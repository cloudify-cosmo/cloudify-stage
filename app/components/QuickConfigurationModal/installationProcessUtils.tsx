import Internal from '../../utils/Internal';
import Manager from '../../utils/Manager';
import { PluginInstallationTask, SecretInstallationTask } from './installationTasksUtils';

export const installPlugin = async (internal: Internal, plugin: PluginInstallationTask) => {
    if (!plugin.yamlUrl || !plugin.wagonUrl) {
        return false;
    }
    const params = {
        visibility: 'tenant',
        title: plugin.title,
        iconUrl: plugin.icon,
        yamlUrl: plugin.yamlUrl,
        wagonUrl: plugin.wagonUrl
    };
    try {
        await internal.doUpload('/plugins/upload', params, null, 'post');
        return true;
    } catch (e) {
        return false;
    }
};

export const createSecret = async (manager: Manager, secret: SecretInstallationTask) => {
    const data = {
        value: secret.value,
        visibility: 'tenant',
        is_hidden_value: true
    };
    try {
        await manager.doPut(`/secrets/${secret.name}`, null, data);
        return true;
    } catch (e) {
        return false;
    }
};

export const updateSecret = async (manager: Manager, secret: SecretInstallationTask) => {
    const data = {
        value: secret.value
    };
    try {
        await manager.doPatch(`/secrets/${secret.name}`, null, data);
        return true;
    } catch (e) {
        return false;
    }
};

export const createResourcesInstaller = (
    manager: Manager,
    internal: Internal,
    onStarted: () => void,
    onProgress: (progress: number) => void,
    onError: (error: string) => void,
    onFinished: () => void
) => {
    let destroyed = false;

    const install = async (
        scheduledPlugins: PluginInstallationTask[],
        updatedSecrets: SecretInstallationTask[],
        createdSecrets: SecretInstallationTask[]
    ) => {
        if (destroyed) {
            return;
        }

        onStarted();
        onProgress(0);

        let stepIndex = 0;
        const stepsCount = scheduledPlugins.length + updatedSecrets.length + createdSecrets.length;

        // eslint-disable-next-line no-restricted-syntax
        for await (const scheduledPlugin of scheduledPlugins) {
            if (scheduledPlugin.yamlUrl && scheduledPlugin.wagonUrl) {
                const result = await installPlugin(internal, scheduledPlugin);
                if (destroyed) return;
                if (!result) {
                    onError(`${scheduledPlugin.name} plugin installation error.`);
                }
            }
            if (destroyed) return;
            stepIndex += 1;
            onProgress(Math.round(100 * (stepIndex / stepsCount)));
        }

        // eslint-disable-next-line no-restricted-syntax
        for await (const updatedSecret of updatedSecrets) {
            const result = await updateSecret(manager, updatedSecret);
            if (destroyed) return;
            if (!result) {
                onError(`${updatedSecret.name} secret update operation error.`);
            }
            if (destroyed) return;
            stepIndex += 1;
            onProgress(Math.round(100 * (stepIndex / stepsCount)));
        }

        // eslint-disable-next-line no-restricted-syntax
        for await (const createdSecret of createdSecrets) {
            const result = await createSecret(manager, createdSecret);
            if (destroyed) return;
            if (!result) {
                onError(`${createdSecret.name} secret create operation error.`);
            }
            if (destroyed) return;
            stepIndex += 1;
            onProgress(Math.round(100 * (stepIndex / stepsCount)));
        }
        onProgress(100);
        onFinished();
    };

    const destroy = () => {
        destroyed = true;
    };

    return { install, destroy };
};
