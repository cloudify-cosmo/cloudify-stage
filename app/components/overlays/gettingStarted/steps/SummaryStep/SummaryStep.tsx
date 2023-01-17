import React, { memo, useEffect, useMemo } from 'react';

import StageUtils from '../../../../../utils/stageUtils';
import { useResettableState } from '../../../../../utils/hooks';
import { Divider, Form, List, Message, Progress } from '../../../../basic';
import useCurrentCallback from '../../common/useCurrentCallback';
import {
    usePluginsInstallationTasks,
    useSecretsInstallationTasks,
    useBlueprintsInstallationTasks
} from '../../installation/tasks';
import { useInternal } from '../../common/managerHooks';
import useManager from '../../../../../utils/hooks/useManager';
import type { TaskDetails, TaskStatus, TaskType } from '../../installation/process';
import { createResourcesInstaller } from '../../installation/process';

import type { GettingStartedData, GettingStartedSchemaItem } from '../../model';
import TaskList from './TaskList';

const tMessages = StageUtils.getT('gettingStartedModal.messages');

type Props = {
    installationMode?: boolean;
    selectedEnvironments: GettingStartedSchemaItem[];
    typedSecrets: GettingStartedData;
    onInstallationStarted?: () => void;
    onInstallationFinished?: () => void;
    onInstallationCanceled?: () => void;
};

const SummaryStep = ({
    installationMode = false,
    selectedEnvironments,
    typedSecrets,
    onInstallationStarted,
    onInstallationFinished,
    onInstallationCanceled
}: Props) => {
    const manager = useManager();
    const internal = useInternal();
    const handleInstallationStarted = useCurrentCallback(onInstallationStarted);
    const handleInstallationFinished = useCurrentCallback(onInstallationFinished);
    const handleInstallationCanceled = useCurrentCallback(onInstallationCanceled);
    const pluginsInstallationTasks = usePluginsInstallationTasks(selectedEnvironments);
    const secretsInstallationTasks = useSecretsInstallationTasks(selectedEnvironments, typedSecrets);
    const blueprintsInstallationTasks = useBlueprintsInstallationTasks(selectedEnvironments);
    const [installationErrors, setInstallationErrors, resetInstallationErrors] = useResettableState<string[]>([]);
    const [installationStatuses, setInstallationStatuses, resetInstallationStatuses] = useResettableState(
        {} as Record<TaskType, Record<string, TaskStatus>>
    );
    const [installationProgress, setInstallationProgress, resetInstallationProgress] = useResettableState<
        number | undefined
    >(undefined);

    useEffect(() => {
        resetInstallationErrors();
        resetInstallationStatuses();
        resetInstallationProgress();
        if (
            installationMode &&
            pluginsInstallationTasks.tasks &&
            secretsInstallationTasks.tasks &&
            blueprintsInstallationTasks.tasks
        ) {
            let installationFinished = false;
            let calculatedInstallationStatuses = {} as Record<TaskType, Record<string, TaskStatus>>;
            const resourcesInstaller = createResourcesInstaller(
                manager,
                internal,
                () => handleInstallationStarted(),
                (calculatedInstallationProgress: number, currentTask?: TaskDetails) => {
                    if (currentTask) {
                        calculatedInstallationStatuses = {
                            ...calculatedInstallationStatuses,
                            [currentTask.type]: {
                                ...calculatedInstallationStatuses[currentTask.type],
                                [currentTask.name]: currentTask.status
                            }
                        };
                        setInstallationStatuses(calculatedInstallationStatuses);
                    }
                    setInstallationProgress(calculatedInstallationProgress);
                },
                (error: string) => setInstallationErrors(status => [...status, error]),
                () => {
                    installationFinished = true;
                    handleInstallationFinished();
                }
            );
            const stringMappedUpdatedSecrets = secretsInstallationTasks.tasks.updatedSecrets.map(secret => ({
                ...secret,
                value: String(secret.value)
            }));
            const stringMappedCreatedSecrets = secretsInstallationTasks.tasks.createdSecrets.map(secret => ({
                ...secret,
                value: String(secret.value)
            }));
            // async installation that can be stopped with destroy() method
            resourcesInstaller.install(
                pluginsInstallationTasks.tasks.scheduledPlugins,
                stringMappedUpdatedSecrets,
                stringMappedCreatedSecrets.filter(secret => !!secret.value),
                blueprintsInstallationTasks.tasks.scheduledBlueprints
            );
            return () => {
                resourcesInstaller.destroy();
                if (!installationFinished) {
                    handleInstallationCanceled();
                }
            };
        }
        return undefined;
    }, [installationMode, pluginsInstallationTasks, secretsInstallationTasks, blueprintsInstallationTasks]);

    const tasksLoading =
        pluginsInstallationTasks.loading || secretsInstallationTasks.loading || blueprintsInstallationTasks.loading;

    const errorDetected =
        !!pluginsInstallationTasks.error ||
        !!secretsInstallationTasks.error ||
        !!blueprintsInstallationTasks.error ||
        installationErrors.length > 0;

    const showTaskListSummary =
        pluginsInstallationTasks.tasks || secretsInstallationTasks.tasks || blueprintsInstallationTasks.tasks;

    const installationProgressMessage: string = useMemo(() => {
        const installationCompleted = installationProgress && installationProgress >= 100;

        if (errorDetected) {
            return tMessages('failureMessage');
        }

        if (installationCompleted) {
            return tMessages('doneMessage');
        }

        return tMessages('progressMessage');
    }, [errorDetected, installationProgress]);

    return (
        <Form style={{ minHeight: 150, flex: 1, display: 'flex', flexDirection: 'column' }} loading={tasksLoading}>
            {errorDetected && (
                <Message color="red">
                    <List relaxed>
                        {pluginsInstallationTasks.error && <List.Item>{pluginsInstallationTasks.error}</List.Item>}
                        {secretsInstallationTasks.error && <List.Item>{secretsInstallationTasks.error}</List.Item>}
                        {blueprintsInstallationTasks.error && (
                            <List.Item>{blueprintsInstallationTasks.error}</List.Item>
                        )}
                        {installationErrors.map(error => (
                            <List.Item key={error}>{error}</List.Item>
                        ))}
                    </List>
                </Message>
            )}
            {showTaskListSummary && (
                <>
                    <TaskList
                        installationStatuses={installationStatuses}
                        pluginsTasks={pluginsInstallationTasks.tasks}
                        secretsTasks={secretsInstallationTasks.tasks}
                        blueprintsTasks={blueprintsInstallationTasks.tasks}
                    />
                    {installationProgress !== undefined && (
                        <>
                            <Divider hidden />
                            <Progress
                                progress
                                size="large"
                                percent={installationProgress}
                                indicating
                                error={errorDetected}
                            >
                                {installationProgressMessage}
                            </Progress>
                        </>
                    )}
                </>
            )}
        </Form>
    );
};

export default memo(SummaryStep);
