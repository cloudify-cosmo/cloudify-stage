import i18n from 'i18next';
import React, { memo, useEffect } from 'react';

import { Divider, Header, Label, List, Message, Progress } from '../../../basic';
import useCurrentCallback from '../../common/useCurrentCallback';
import { createResourcesInstaller } from '../../installation/process';
import { usePluginInstallationTasks, useSecretsInstallationTasks } from '../../installation/tasks';
import { useInternal, useManager } from '../../common/managerHooks';
import PluginTaskItems, { InstalledPluginDescription, RejectedPluginDescription } from './PluginTaskItems';
import { UnsafelyTypedForm } from '../../unsafelyTypedForm';

import type { GettingStartedData, GettingStartedSchema } from '../../model';
import { useResettableState } from '../../../../utils/hooks';

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
    const [installationErrors, setInstallationErrors, resetInstallationErrors] = useResettableState<string[]>([]);
    const [installationProgress, setInstallationProgress, resetInstallationProgress] = useResettableState<
        number | undefined
    >(undefined);

    useEffect(() => {
        resetInstallationErrors();
        resetInstallationProgress();
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
        <UnsafelyTypedForm
            style={{ minHeight: 150 }}
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
                    <Header as="h4">{i18n.t('gettingStartedModal.summary.taskListTitle')}</Header>
                    <List ordered relaxed>
                        {pluginInstallationTasks.tasks && (
                            <>
                                <PluginTaskItems
                                    tasks={pluginInstallationTasks.tasks.installedPlugins}
                                    description={<InstalledPluginDescription />}
                                />
                                <PluginTaskItems
                                    tasks={pluginInstallationTasks.tasks.scheduledPlugins}
                                    description={i18n.t('gettingStartedModal.summary.pluginInstalMessageSuffix')}
                                />
                                <PluginTaskItems
                                    tasks={pluginInstallationTasks.tasks.rejectedPlugins}
                                    description={<RejectedPluginDescription />}
                                />
                            </>
                        )}
                        {secretInstallationTasks.tasks?.createdSecrets.map(createdSecret => {
                            return (
                                <List.Item key={createdSecret.name}>
                                    <Label horizontal>{createdSecret.name}</Label>{' '}
                                    {i18n.t('gettingStartedModal.summary.secretCreateMessageSuffix')}
                                </List.Item>
                            );
                        })}
                        {secretInstallationTasks.tasks?.updatedSecrets.map(updatedSecret => {
                            return (
                                <List.Item key={updatedSecret.name}>
                                    <Label horizontal>{updatedSecret.name}</Label>{' '}
                                    {i18n.t('gettingStartedModal.summary.secretUpdateMessageSuffix')}
                                </List.Item>
                            );
                        })}
                    </List>
                    {installationProgress !== undefined && (
                        <>
                            <Divider hidden />
                            <Progress progress size="large" percent={installationProgress} indicating>
                                {installationProgress < 100
                                    ? i18n.t('gettingStartedModal.installation.progressMessage')
                                    : i18n.t('gettingStartedModal.installation.doneMessage')}
                            </Progress>
                        </>
                    )}
                </>
            )}
        </UnsafelyTypedForm>
    );
};

export default memo(SummaryStep);
