import i18n from 'i18next';
import React, { memo, useEffect } from 'react';

import StageUtils from '../../../../utils/stageUtils';
import { useResettableState } from '../../../../utils/hooks';
import { Divider, Form, Header, List, Message, Progress } from '../../../basic';
import useCurrentCallback from '../../common/useCurrentCallback';
import {
    usePluginsInstallationTasks,
    useSecretsInstallationTasks,
    useBlueprintsInstallationTasks
} from '../../installation/tasks';
import { useInternal } from '../../common/managerHooks';
import useManager from '../../../../utils/hooks/useManager';
import { createResourcesInstaller, TaskDetails, TaskStatus, TaskType } from '../../installation/process';
import PluginsInstallationTasks from './PluginsInstallationTasks';
import SecretsInstallationTasks from './SecretsInstallationTasks';
import BlueprintsInstallationTasks from './BlueprintsInstallationTasks';

import type { GettingStartedData, GettingStartedSchema } from '../../model';

const tMessages = StageUtils.getT('gettingStartedModal.messages');

type Props = {
    installationMode?: boolean;
    selectedEnvironments: GettingStartedSchema;
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
            // async installation that can be stopped with destroy() method
            resourcesInstaller.install(
                pluginsInstallationTasks.tasks.scheduledPlugins,
                secretsInstallationTasks.tasks.updatedSecrets,
                secretsInstallationTasks.tasks.createdSecrets.filter(secret => !!secret.value),
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
        pluginsInstallationTasks.error ||
        secretsInstallationTasks.error ||
        blueprintsInstallationTasks.error ||
        installationErrors.length > 0;

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
            {(pluginsInstallationTasks.tasks ||
                secretsInstallationTasks.tasks ||
                blueprintsInstallationTasks.tasks) && (
                <>
                    <Header as="h4">{i18n.t('gettingStartedModal.summary.taskListTitle')}</Header>
                    <List relaxed style={{ margin: 0, flex: 1, overflow: 'auto' }}>
                        <PluginsInstallationTasks
                            tasks={pluginsInstallationTasks.tasks}
                            statuses={installationStatuses.plugin}
                        />
                        <SecretsInstallationTasks
                            tasks={secretsInstallationTasks.tasks}
                            statuses={installationStatuses.secret}
                        />
                        <BlueprintsInstallationTasks
                            tasks={blueprintsInstallationTasks.tasks}
                            statuses={installationStatuses.blueprint}
                        />
                    </List>
                    {installationProgress !== undefined && (
                        <>
                            <Divider hidden />
                            <Progress progress size="large" percent={installationProgress} indicating>
                                {installationProgress < 100 ? tMessages('progressMessage') : tMessages('doneMessage')}
                            </Progress>
                        </>
                    )}
                </>
            )}
        </Form>
    );
};

export default memo(SummaryStep);
