import log from 'loglevel';
import isEmpty from 'lodash/isEmpty';
import type { PostPluginsUploadQueryParams } from 'backend/routes/Plugins.types';
import StageUtils from '../../../../utils/stageUtils';
import type Internal from '../../../../utils/Internal';
import type Manager from '../../../../utils/Manager';
import type { BlueprintInstallationTask, PluginInstallationTask, SecretInstallationTask } from './tasks';

export enum TaskType {
    Plugin = 'plugin',
    Secret = 'secret',
    Blueprint = 'blueprint'
}

export type TaskDetails = {
    type: TaskType;
    name: string;
    status: TaskStatus;
};

export enum TaskStatus {
    InstallationProgress = 'installation-progress',
    InstallationDone = 'installation-done',
    InstallationError = 'installation-error'
}

const translate = StageUtils.getT('gettingStartedModal.messages');
const sleep = async (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));

// TODO(RD-1874): use common api for backend requests
export const installPlugin = async (internal: Internal, plugin: PluginInstallationTask) => {
    if (isEmpty(plugin.yamlUrls) || !plugin.wagonUrl) {
        return false;
    }
    const params = {
        visibility: 'tenant',
        title: plugin.title,
        iconUrl: plugin.icon,
        yamlUrl: plugin.yamlUrls,
        wagonUrl: plugin.wagonUrl
    };
    try {
        await internal.doUpload<any, PostPluginsUploadQueryParams>('/plugins/upload', { params, method: 'post' });
        return true;
    } catch (e) {
        log.error(e);
        return false;
    }
};

// TODO(RD-1874): use common api for backend requests
export const createSecret = async (manager: Manager, secret: SecretInstallationTask) => {
    const body = {
        value: secret.value,
        visibility: 'tenant',
        is_hidden_value: true
    };
    try {
        await manager.doPut(`/secrets/${encodeURIComponent(secret.name)}`, { body });
        return true;
    } catch (e) {
        log.error(e);
        return false;
    }
};

// TODO(RD-1874): use common api for backend requests
export const updateSecret = async (manager: Manager, secret: SecretInstallationTask) => {
    const body = {
        value: secret.value
    };
    try {
        await manager.doPatch(`/secrets/${encodeURIComponent(secret.name)}`, { body });
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
    const params = {
        visibility: 'tenant',
        async_upload: true,
        application_file_name: blueprint.blueprintYamlFile,
        blueprint_archive_url: blueprint.blueprintZipUrl
    };
    try {
        const uploadResponse = await manager.doPut(`/blueprints/${encodeURIComponent(blueprint.blueprintName)}`, {
            params
        });
        if (uploadResponse.error) {
            return translate('blueprintUploadError', {
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
                    return translate('blueprintUploadError', {
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
    return translate('blueprintUploadError', {
        blueprintName: blueprint.blueprintName,
        uploadError: translate('timeoutExceededError')
    });
};

export const createResourcesInstaller = (
    manager: Manager,
    internal: Internal,
    onStarted: () => void,
    onProgress: (installationProgress: number, currentTask?: TaskDetails) => void,
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

        const triggerProgressEvent = (taskType: TaskType, taskName: string, taskStatus: TaskStatus) => {
            const installationProgress = Math.round(100 * (stepIndex / stepsCount));
            const currentTask = { type: taskType, name: taskName, status: taskStatus };
            onProgress(installationProgress, currentTask);
        };

        const updateStepIndex = (taskType: TaskType, taskName: string, taskStatus: TaskStatus) => {
            stepIndex += 1;
            triggerProgressEvent(taskType, taskName, taskStatus);
        };

        const runInstallPluginStep = async (scheduledPlugin: PluginInstallationTask) => {
            let result = false;
            if (!isEmpty(scheduledPlugin.yamlUrls) && scheduledPlugin.wagonUrl) {
                triggerProgressEvent(TaskType.Plugin, scheduledPlugin.name, TaskStatus.InstallationProgress);
                result = await installPlugin(internal, scheduledPlugin);
                if (destroyed) return;
                if (!result) {
                    onError(
                        translate('pluginInstallError', {
                            pluginName: scheduledPlugin.name
                        })
                    );
                }
            }
            if (destroyed) return;
            updateStepIndex(
                TaskType.Plugin,
                scheduledPlugin.name,
                result ? TaskStatus.InstallationDone : TaskStatus.InstallationError
            );
        };

        const runUpdateSecretStep = async (updatedSecret: SecretInstallationTask) => {
            triggerProgressEvent(TaskType.Plugin, updatedSecret.name, TaskStatus.InstallationProgress);
            const result = await updateSecret(manager, updatedSecret);
            if (destroyed) return;
            if (!result) {
                onError(
                    translate('secretUpdateError', {
                        secretName: updatedSecret.name
                    })
                );
            }
            if (destroyed) return;
            updateStepIndex(
                TaskType.Secret,
                updatedSecret.name,
                result ? TaskStatus.InstallationDone : TaskStatus.InstallationError
            );
        };

        const runCreateSecretStep = async (createdSecret: SecretInstallationTask) => {
            triggerProgressEvent(TaskType.Plugin, createdSecret.name, TaskStatus.InstallationProgress);
            const result = await createSecret(manager, createdSecret);
            if (destroyed) return;
            if (!result) {
                onError(
                    translate('secretCreateError', {
                        secretName: createdSecret.name
                    })
                );
            }
            if (destroyed) return;
            updateStepIndex(
                TaskType.Secret,
                createdSecret.name,
                result ? TaskStatus.InstallationDone : TaskStatus.InstallationError
            );
        };

        const runUploadBlueprintStep = async (scheduledBlueprint: BlueprintInstallationTask) => {
            triggerProgressEvent(TaskType.Blueprint, scheduledBlueprint.blueprintName, TaskStatus.InstallationProgress);
            const uploadError = await uploadBlueprint(manager, scheduledBlueprint);
            if (destroyed) return;
            if (uploadError) {
                onError(uploadError);
            }
            if (destroyed) return;
            updateStepIndex(
                TaskType.Blueprint,
                scheduledBlueprint.blueprintName,
                uploadError ? TaskStatus.InstallationError : TaskStatus.InstallationDone
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
