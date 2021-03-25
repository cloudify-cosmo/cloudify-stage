import i18n from 'i18next';
import React, { memo, useEffect, useState } from 'react';

import type { FC } from 'react';

import { Divider, Form, Header, Label, List, Message, Progress } from '../../../basic';
import useCurrentCallback from '../../common/useCurrentCallback';
import { createResourcesInstaller } from '../../installation/process';
import { usePluginInstallationTasks, useSecretsInstallationTasks } from '../../installation/tasks';
import { useInternal, useManager } from '../../managerHooks';
import PluginTaskItems, { installedPluginDescription, rejectedPluginDescription } from './PluginTaskItems';

import type { GettingStartedData, GettingStartedSchema } from '../../model';

// TODO(RD-1837): remove it after after forms will be changed to tsx version
const UnsafelyTypedForm = (Form as unknown) as FC<{ [x: string]: any }>;

type Props = {
    installationMode?: boolean;
    selectedPlugins: GettingStartedSchema;
    typedSecrets: GettingStartedData;
    onInstallationStarted?: () => void;
    onInstallationFinished?: () => void;
    onInstallationCanceled?: () => void;
};

const SummaryStep = ({
    installationMode = false,
    selectedPlugins,
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
    const pluginInstallationTasks = usePluginInstallationTasks(selectedPlugins);
    const secretInstallationTasks = useSecretsInstallationTasks(selectedPlugins, typedSecrets);
    const [installationErrors, setInstallationErrors] = useState<string[]>([]);
    const [installationProgress, setInstallationProgress] = useState<number>();

    useEffect(() => {
        setInstallationErrors([]);
        setInstallationProgress(undefined);
        if (installationMode && pluginInstallationTasks.tasks && secretInstallationTasks.tasks) {
            let installationFinished = false;
            const resourcesInstaller = createResourcesInstaller(
                manager,
                internal,
                () => handleInstallationStarted(),
                (progress: number) => setInstallationProgress(progress),
                (error: string) => setInstallationErrors([...installationErrors, error]),
                () => {
                    installationFinished = true;
                    handleInstallationFinished();
                }
            );
            // async installation that can be stopped with destroy() method
            resourcesInstaller.install(
                pluginInstallationTasks.tasks.scheduledPlugins,
                secretInstallationTasks.tasks.updatedSecrets,
                secretInstallationTasks.tasks.createdSecrets
            );
            return () => {
                resourcesInstaller.destroy();
                if (!installationFinished) {
                    handleInstallationCanceled();
                }
            };
        }
        return undefined;
    }, [installationMode, pluginInstallationTasks, secretInstallationTasks]);

    return (
        // TODO(RD-1837): change to <Form ...> after forms will be changed to tsx version
        <UnsafelyTypedForm
            style={{ minHeight: '150px' }}
            loading={pluginInstallationTasks.loading || secretInstallationTasks.loading}
        >
            {(pluginInstallationTasks.error || secretInstallationTasks.error) && (
                <Message color="red">
                    {pluginInstallationTasks.error && <p>{pluginInstallationTasks.error}</p>}
                    {secretInstallationTasks.error && <p>{secretInstallationTasks.error}</p>}
                </Message>
            )}
            {(pluginInstallationTasks.tasks || secretInstallationTasks.tasks) && (
                <>
                    <Header as="h4">{i18n.t('gettingStartedModal.summary.taskListTitle', 'Task List')}</Header>
                    <List ordered relaxed>
                        {pluginInstallationTasks.tasks && (
                            <>
                                <PluginTaskItems
                                    tasks={pluginInstallationTasks.tasks.installedPlugins}
                                    description={installedPluginDescription}
                                />
                                <PluginTaskItems
                                    tasks={pluginInstallationTasks.tasks.scheduledPlugins}
                                    description={i18n.t(
                                        'gettingStartedModal.summary.pluginInstallationMessageSuffix',
                                        'plugin will be installed.'
                                    )}
                                />
                                <PluginTaskItems
                                    tasks={pluginInstallationTasks.tasks.rejectedPlugins}
                                    description={rejectedPluginDescription}
                                />
                            </>
                        )}
                        {secretInstallationTasks.tasks?.createdSecrets.map(createdSecret => {
                            return (
                                <List.Item key={createdSecret.name}>
                                    <Label horizontal>{createdSecret.name}</Label>{' '}
                                    {i18n.t(
                                        'gettingStartedModal.summary.secretCreateMessageSuffix',
                                        'secret will be created'
                                    )}
                                </List.Item>
                            );
                        })}
                        {secretInstallationTasks.tasks?.updatedSecrets.map(updatedSecret => {
                            return (
                                <List.Item key={updatedSecret.name}>
                                    <Label horizontal>{updatedSecret.name}</Label>{' '}
                                    {i18n.t(
                                        'gettingStartedModal.summary.secretUpdateMessageSuffix',
                                        'secret will be updated'
                                    )}
                                </List.Item>
                            );
                        })}
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
            {/* TODO(RD-1837): change to </Form> after forms will be changed to tsx version  */}
        </UnsafelyTypedForm>
    );
};

export default memo(SummaryStep);
