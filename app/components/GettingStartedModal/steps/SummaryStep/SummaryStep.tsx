import i18n from 'i18next';
import React, { memo, useEffect, useState } from 'react';

import type { FC } from 'react';

import { Divider, Form, Header, List, Message, Progress } from '../../../basic';
import { useInternal, useManager } from '../../managerHooks';
import useCurrentCallback from '../../common/useCurrentCallback';
import {
    useBlueprintsInstallationTasks,
    usePluginsInstallationTasks,
    useSecretsInstallationTasks
} from '../../installation/tasks';
import { createResourcesInstaller } from '../../installation/process';
import PluginsInstallationTasks from './PluginsInstallationTasks';
import SecretsInstallationTasks from './SecretsInstallationTasks';
import BlueprintsInstallationTasks from './BlueprintsInstallationTasks';

import type { GettingStartedData, GettingStartedSchema } from '../../model';

// TODO(RD-1837): remove it after after forms will be changed to tsx version
const UnsafelyTypedForm = (Form as unknown) as FC<{ [x: string]: any }>;

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
    const [installationErrors, setInstallationErrors] = useState<string[]>([]);
    const [installationProgress, setInstallationProgress] = useState<number>();

    useEffect(() => {
        setInstallationErrors([]);
        setInstallationProgress(undefined);
        if (
            installationMode &&
            pluginsInstallationTasks.tasks &&
            secretsInstallationTasks.tasks &&
            blueprintsInstallationTasks.tasks
        ) {
            let installationFinished = false;
            const resourcesInstaller = createResourcesInstaller(
                manager,
                internal,
                () => handleInstallationStarted(),
                (progress: number) => setInstallationProgress(progress),
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
        // TODO(RD-1837): change to <From ...> after forms will be changed to tsx version
        <UnsafelyTypedForm style={{ minHeight: '150px' }} loading={tasksLoading}>
            {errorDetected && (
                <Message color="red">
                    {pluginsInstallationTasks.error && <p>{pluginsInstallationTasks.error}</p>}
                    {secretsInstallationTasks.error && <p>{secretsInstallationTasks.error}</p>}
                    {blueprintsInstallationTasks.error && <p>{blueprintsInstallationTasks.error}</p>}
                    {installationErrors.map((error, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <p key={index}>{error}</p>
                    ))}
                </Message>
            )}
            {pluginsInstallationTasks.tasks && secretsInstallationTasks.tasks && blueprintsInstallationTasks.tasks && (
                <>
                    <Header as="h4">{i18n.t('gettingStartedModal.summary.taskListTitle', 'Task List')}</Header>
                    <List ordered relaxed>
                        <PluginsInstallationTasks tasks={pluginsInstallationTasks.tasks} />
                        <SecretsInstallationTasks tasks={secretsInstallationTasks.tasks} />
                        <BlueprintsInstallationTasks tasks={blueprintsInstallationTasks.tasks} />
                    </List>
                    {installationProgress !== undefined && (
                        <>
                            <Divider hidden />
                            <Progress progress size="large" percent={installationProgress} indicating>
                                {installationProgress < 100
                                    ? i18n.t(
                                          'gettingStartedModal.installation.progressMessage',
                                          'Installation in progress...'
                                      )
                                    : i18n.t('gettingStartedModal.installation.doneMessage', 'Installation done!')}
                            </Progress>
                        </>
                    )}
                </>
            )}
            {/* TODO(RD-1837): change to </From> after forms will be changed to tsx version  */}
        </UnsafelyTypedForm>
    );
};

export default memo(SummaryStep);
