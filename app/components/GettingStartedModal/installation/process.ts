import i18n from 'i18next';
import log from 'loglevel';

import type Internal from '../../../utils/Internal';
import type Manager from '../../../utils/Manager';
import type { BlueprintInstallationTask, PluginInstallationTask, SecretInstallationTask } from './tasks';

const sleep = async (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));

// TODO(RD-1874): use common api for backend requests
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

// TODO(RD-1874): use common api for backend requests
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
        log.error(e);
        return false;
    }
};

// TODO(RD-1874): use common api for backend requests
export const updateSecret = async (manager: Manager, secret: SecretInstallationTask) => {
    const data = {
        value: secret.value
    };
    try {
        await manager.doPatch(`/secrets/${encodeURIComponent(secret.name)}`, null, data);
        return true;
    } catch (e) {
        log.error(e);
        return false;
    }
};

// TODO(RD-2086): use common functions to upload blueprints
export const uploadBlueprint = async (manager: Manager, blueprint: BlueprintInstallationTask) => {
    const waitingTimeoutSecs = 5 * 60;
    const stepSleepSecs = 5;
    const requestData = {
        visibility: 'tenant',
        async_upload: true,
        application_file_name: blueprint.blueprintYamlFile,
        blueprint_archive_url: blueprint.blueprintZipUrl
    };
    try {
        const uploadResponse = await manager.doPut(
            `/blueprints/${encodeURIComponent(blueprint.blueprintName)}`,
            requestData
        );
        if (uploadResponse.error) {
            return i18n.t('gettingStartedModal.installation.blueprintUploadError', undefined, {
                blueprintName: blueprint.blueprintName,
                uploadError: uploadResponse.error
            });
        }
    } catch (e) {
        log.error(e);
        return false;
    }
    const iterationsCount = Math.round(waitingTimeoutSecs / stepSleepSecs);
    for (let i = 0; i < iterationsCount; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(1000 * stepSleepSecs);
        try {
            // eslint-disable-next-line no-await-in-loop
            const statusResponse = await manager.doGet(`/blueprints/${encodeURIComponent(blueprint.blueprintName)}`);
            if (statusResponse) {
                if (statusResponse.error) {
                    return i18n.t('gettingStartedModal.installation.blueprintUploadError', undefined, {
                        blueprintName: blueprint.blueprintName,
                        uploadError: statusResponse.error
                    });
                }
                if (statusResponse.state === 'uploaded') {
                    return null;
                }
            }
        } catch (e) {
            log.error(e);
        }
    }
    return i18n.t('gettingStartedModal.installation.blueprintUploadError', undefined, {
        blueprintName: blueprint.blueprintName,
        uploadError: i18n.t('gettingStartedModal.installation.timeoutExceededError')
    });
};

export const createResourcesInstaller = (
    manager: Manager,
    internal: Internal,
    onStarted: () => void,
    onProgress: (installationProgress: number, taskType?: string, taskName?: string, taskSuccess?: string) => void,
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

        let stepIndex = 0;
        const stepsCount =
            scheduledPlugins.length + updatedSecrets.length + createdSecrets.length + scheduledBlueprints.length;

        const fireProgressEvent = (taskType: string, taskName: string, taskSuccess: string) =>
            onProgress(Math.round(100 * (stepIndex / stepsCount)), taskType, taskName, taskSuccess);

        const updateStepIndex = (taskType: string, taskName: string, taskSuccess: string) => {
            stepIndex += 1;
            fireProgressEvent(taskType, taskName, taskSuccess);
        };

        const runInstallPluginStep = async (scheduledPlugin: PluginInstallationTask) => {
            let result = false;
            if (scheduledPlugin.yamlUrl && scheduledPlugin.wagonUrl) {
                fireProgressEvent('plugin', scheduledPlugin.name, 'installation-progress');
                result = await installPlugin(internal, scheduledPlugin);
                if (destroyed) return;
                if (!result) {
                    onError(
                        i18n.t('gettingStartedModal.installation.pluginInstallError', undefined, {
                            pluginName: scheduledPlugin.name
                        })
                    );
                }
            }
            if (destroyed) return;
            updateStepIndex('plugin', scheduledPlugin.name, result ? 'installation-done' : 'installation-error');
        };

        const runUpdateSecretStep = async (updatedSecret: SecretInstallationTask) => {
            fireProgressEvent('plugin', updatedSecret.name, 'installation-progress');
            const result = await updateSecret(manager, updatedSecret);
            if (destroyed) return;
            if (!result) {
                onError(
                    i18n.t('gettingStartedModal.installation.secretUpdateError', undefined, {
                        secretName: updatedSecret.name
                    })
                );
            }
            if (destroyed) return;
            updateStepIndex('secret', updatedSecret.name, result ? 'installation-done' : 'installation-error');
        };

        const runCreateSecretStep = async (createdSecret: SecretInstallationTask) => {
            fireProgressEvent('plugin', createdSecret.name, 'installation-progress');
            const result = await createSecret(manager, createdSecret);
            if (destroyed) return;
            if (!result) {
                onError(
                    i18n.t('gettingStartedModal.installation.secretCreateError', undefined, {
                        secretName: createdSecret.name
                    })
                );
            }
            if (destroyed) return;
            updateStepIndex('secret', createdSecret.name, result ? 'installation-done' : 'installation-error');
        };

        const runUploadBlueprintStep = async (scheduledBlueprint: BlueprintInstallationTask) => {
            fireProgressEvent('blueprint', scheduledBlueprint.blueprintName, 'installation-progress');
            const uploadError = await uploadBlueprint(manager, scheduledBlueprint);
            if (destroyed) return;
            if (uploadError) {
                onError(uploadError);
            }
            if (destroyed) return;
            updateStepIndex(
                'blueprint',
                scheduledBlueprint.blueprintName,
                uploadError ? 'installation-error' : 'installation-done'
            );
        };

        onStarted();
        onProgress(0);

        await Promise.all([
            ...scheduledPlugins.map(runInstallPluginStep),
            ...updatedSecrets.map(runUpdateSecretStep),
            ...createdSecrets.map(runCreateSecretStep)
        ]);

        await Promise.all(scheduledBlueprints.map(runUploadBlueprintStep));

        onProgress(100);
        onFinished();
    };

    const destroy = () => {
        destroyed = true;
    };

    return { install, destroy };
};
