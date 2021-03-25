import i18n from 'i18next';
import log from 'loglevel';

import type Internal from '../../../utils/Internal';
import type Manager from '../../../utils/Manager';
import type { PluginInstallationTask, SecretInstallationTask } from './tasks';

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
        log.error(e);
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
        log.error(e);
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
        log.error(e);
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

        let stepIndex = 0;
        const stepsCount = scheduledPlugins.length + updatedSecrets.length + createdSecrets.length;

        const updateStepIndex = () => {
            stepIndex += 1;
            onProgress(Math.round(100 * (stepIndex / stepsCount)));
        };

        const runInstallPluginStep = async (scheduledPlugin: PluginInstallationTask) => {
            if (scheduledPlugin.yamlUrl && scheduledPlugin.wagonUrl) {
                const result = await installPlugin(internal, scheduledPlugin);
                if (destroyed) return;
                if (!result) {
                    onError(
                        i18n.t(
                            'gettingStartedModal.installation.pluginInstallError',
                            '{{scheduledPlugin.name}} plugin installation error.',
                            { scheduledPlugin }
                        )
                    );
                }
            }
            if (destroyed) return;
            updateStepIndex();
        };

        const runUpdateSecretStep = async (updatedSecret: SecretInstallationTask) => {
            const result = await updateSecret(manager, updatedSecret);
            if (destroyed) return;
            if (!result) {
                onError(
                    i18n.t(
                        'gettingStartedModal.installation.secretUpdateError',
                        '{{updatedSecret.name}} secret update operation error.',
                        { updatedSecret }
                    )
                );
            }
            if (destroyed) return;
            updateStepIndex();
        };

        const runCreateSecretStep = async (createdSecret: SecretInstallationTask) => {
            const result = await createSecret(manager, createdSecret);
            if (destroyed) return;
            if (!result) {
                onError(
                    i18n.t(
                        'gettingStartedModal.installation.secretCreateError',
                        '{{createdSecret.name}} secret create operation error.',
                        { createdSecret }
                    )
                );
            }
            if (destroyed) return;
            updateStepIndex();
        };

        onStarted();
        onProgress(0);

        await Promise.all([
            ...scheduledPlugins.map(runInstallPluginStep),
            ...updatedSecrets.map(runUpdateSecretStep),
            ...createdSecrets.map(runCreateSecretStep)
        ]);

        onProgress(100);
        onFinished();
    };

    const destroy = () => {
        destroyed = true;
    };

    return { install, destroy };
};
