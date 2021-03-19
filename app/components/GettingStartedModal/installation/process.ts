/* eslint-disable no-lone-blocks */
import i18n from 'i18next';

import type Internal from '../../../utils/Internal';
import type Manager from '../../../utils/Manager';
import type { BlueprintInstallationTask, PluginInstallationTask, SecretInstallationTask } from './tasks';

const sleep = async (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));

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
        // eslint-disable-next-line no-console
        console.error(e);
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
        await manager.doPut(`/secrets/${encodeURIComponent(secret.name)}`, null, data);
        return true;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        return false;
    }
};

export const updateSecret = async (manager: Manager, secret: SecretInstallationTask) => {
    const data = {
        value: secret.value
    };
    try {
        await manager.doPatch(`/secrets/${encodeURIComponent(secret.name)}`, null, data);
        return true;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        return false;
    }
};

export const uploadBlueprint = async (manager: Manager, blueprint: BlueprintInstallationTask) => {
    const waitingTimeout = 120; // ~120s = 5s sleeps + requests
    const stepSleep = 5; // 5s
    const requestData = {
        visibility: 'tenant',
        async_upload: true,
        application_file_name: blueprint.applicationName,
        blueprint_archive_url: blueprint.blueprintUrl
    };
    try {
        const uploadResponse = await manager.doPut(
            `/blueprints/${encodeURIComponent(blueprint.blueprintName)}`,
            requestData
        );
        if (uploadResponse.error) {
            return `${blueprint.blueprintName} blueprint uploading error: ${uploadResponse.error}.`;
        }
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }
    const iterationsCount = Math.round(waitingTimeout / stepSleep);
    for (let i = 0; i < iterationsCount; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(1000 * stepSleep);
        try {
            // eslint-disable-next-line no-await-in-loop
            const statusResponse = await manager.doGet(`/blueprints/${encodeURIComponent(blueprint.blueprintName)}`);
            if (statusResponse) {
                if (statusResponse.error) {
                    return `${blueprint.blueprintName} blueprint uploading error:\n${statusResponse.error}.`;
                }
                if (statusResponse.state === 'uploaded') {
                    return null;
                }
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }
    }
    return `${blueprint.blueprintName} blueprint uploading error: Timeout exceed.`;
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
        createdSecrets: SecretInstallationTask[],
        scheduledBlueprints: BlueprintInstallationTask[]
    ) => {
        if (destroyed) {
            return;
        }

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
            stepIndex += 1;
            onProgress(Math.round(100 * (stepIndex / stepsCount)));
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
            stepIndex += 1;
            onProgress(Math.round(100 * (stepIndex / stepsCount)));
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
            stepIndex += 1;
            onProgress(Math.round(100 * (stepIndex / stepsCount)));
        };

        const runUploadBlueprintStep = async (scheduledBlueprint: BlueprintInstallationTask) => {
            const uploadError = await uploadBlueprint(manager, scheduledBlueprint);
            if (destroyed) return;
            if (uploadError) {
                onError(uploadError);
                // onError(
                //     i18n.t(
                //         'gettingStartedModal.installation.blueprintUploadError',
                //         '{{scheduledBlueprint.blueprintName}} blueprint upload error.',
                //         { scheduledBlueprint }
                //     )
                // );
            }
            if (destroyed) return;
            stepIndex += 1;
            onProgress(Math.round(100 * (stepIndex / stepsCount)));
        };

        let stepIndex = 0;
        const stepsCount =
            scheduledPlugins.length + updatedSecrets.length + createdSecrets.length + scheduledBlueprints.length;

        onStarted();
        onProgress(0);

        await Promise.all([
            ...scheduledPlugins.map(runInstallPluginStep),
            ...updatedSecrets.map(runUpdateSecretStep),
            ...createdSecrets.map(runCreateSecretStep)
        ]);

        // TODO: check if plugin and secrets are installed before
        await Promise.all(scheduledBlueprints.map(runUploadBlueprintStep));

        onProgress(100);
        onFinished();
    };

    const destroy = () => {
        destroyed = true;
    };

    return { install, destroy };
};
