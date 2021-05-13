import i18n from 'i18next';
import React, { memo, useEffect } from 'react';

import StageUtils from '../../../../utils/stageUtils';
import { useResettableState } from '../../../../utils/hooks';
import { Divider, Header, List, Message, Progress } from '../../../basic';
import useCurrentCallback from '../../common/useCurrentCallback';
import {
    usePluginsInstallationTasks,
    useSecretsInstallationTasks,
    useBlueprintsInstallationTasks
} from '../../installation/tasks';
import { useInternal, useManager } from '../../common/managerHooks';
import { UnsafelyTypedForm } from '../../unsafelyTypedForm';
import { createResourcesInstaller, TasksProgress, TaskStatus, TaskType } from '../../installation/process';
import PluginsInstallationTasks from './PluginsInstallationTasks';
import SecretsInstallationTasks from './SecretsInstallationTasks';
import BlueprintsInstallationTasks from './BlueprintsInstallationTasks';

import type { GettingStartedData, GettingStartedSchema } from '../../model';

const tMessages = StageUtils.getT('gettingStartedModal.messages');

type Props = {
    installationMode?: boolean;
    selectedTechnologies: GettingStartedSchema;
    typedSecrets: GettingStartedData;
    onInstallationStarted?: () => void;
    onInstallationFinished?: () => void;
    onInstallationCanceled?: () => void;
};

const SummaryStep = ({
    installationMode = false,
    selectedTechnologies,
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
    const pluginsInstallationTasks = usePluginsInstallationTasks(selectedTechnologies);
    const secretsInstallationTasks = useSecretsInstallationTasks(selectedTechnologies, typedSecrets);
    const blueprintsInstallationTasks = useBlueprintsInstallationTasks(selectedTechnologies);
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
                ({ tasksProgress, taskType, taskName, taskStatus }: TasksProgress) => {
                    if (taskType && taskName && taskStatus) {
                        calculatedInstallationStatuses = {
                            ...calculatedInstallationStatuses,
                            [taskType]: { ...calculatedInstallationStatuses[taskType], [taskName]: taskStatus }
                        };
                        setInstallationStatuses(calculatedInstallationStatuses);
                    }
                    setInstallationProgress(tasksProgress);
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
                secretsInstallationTasks.tasks.createdSecrets,
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
        <UnsafelyTypedForm style={{ minHeight: 150 }} loading={tasksLoading}>
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
                    <List ordered relaxed>
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
        </UnsafelyTypedForm>
    );
};

export default memo(SummaryStep);
