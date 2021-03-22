import i18n from 'i18next';
import React, { memo, useEffect } from 'react';

import { useResettableState } from '../../../../utils/hooks';
import { Divider, Header, Icon, Label, List, Message, Progress } from '../../../basic';
import useCurrentCallback from '../../common/useCurrentCallback';
import { createResourcesInstaller } from '../../installation/process';
import {
    usePluginsInstallationTasks,
    useSecretsInstallationTasks,
    useBlueprintsInstallationTasks
} from '../../installation/tasks';
import { useInternal, useManager } from '../../common/managerHooks';
import PluginTaskItems, { InstalledPluginDescription, RejectedPluginDescription } from './PluginTaskItems';
import { UnsafelyTypedForm } from '../../unsafelyTypedForm';

import type { GettingStartedData, GettingStartedSchema } from '../../model';

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
    const [installationProgress, setInstallationProgress, resetInstallationProgress] = useResettableState<
        number | undefined
    >(undefined);

    useEffect(() => {
        resetInstallationErrors();
        resetInstallationProgress();
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

    return (
        <UnsafelyTypedForm
            style={{ minHeight: 150 }}
            loading={pluginsInstallationTasks.loading || secretsInstallationTasks.loading}
        >
            {(pluginsInstallationTasks.error ||
                secretsInstallationTasks.error ||
                blueprintsInstallationTasks.error ||
                installationErrors.length > 0) && (
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
            {(pluginsInstallationTasks.tasks ||
                secretsInstallationTasks.tasks ||
                blueprintsInstallationTasks.tasks) && (
                <>
                    <Header as="h4">{i18n.t('gettingStartedModal.summary.taskListTitle')}</Header>
                    <List ordered relaxed>
                        {pluginsInstallationTasks.tasks && (
                            <>
                                <PluginTaskItems
                                    tasks={pluginsInstallationTasks.tasks.installedPlugins}
                                    description={<InstalledPluginDescription />}
                                />
                                <PluginTaskItems
                                    tasks={pluginsInstallationTasks.tasks.scheduledPlugins}
                                    description={i18n.t('gettingStartedModal.summary.pluginInstalMessageSuffix')}
                                />
                                <PluginTaskItems
                                    tasks={pluginsInstallationTasks.tasks.rejectedPlugins}
                                    description={<RejectedPluginDescription />}
                                />
                            </>
                        )}
                        {secretsInstallationTasks.tasks?.createdSecrets.map(createdSecret => {
                            return (
                                <List.Item key={createdSecret.name}>
                                    <Label horizontal>{createdSecret.name}</Label>{' '}
                                    {i18n.t('gettingStartedModal.summary.secretCreateMessageSuffix')}
                                </List.Item>
                            );
                        })}
                        {secretsInstallationTasks.tasks?.updatedSecrets.map(updatedSecret => {
                            return (
                                <List.Item key={updatedSecret.name}>
                                    <Label horizontal>{updatedSecret.name}</Label>{' '}
                                    {i18n.t('gettingStartedModal.summary.secretUpdateMessageSuffix')}
                                </List.Item>
                            );
                        })}
                        {blueprintsInstallationTasks.tasks?.uploadedBlueprints.map(blueprint => {
                            // TODO: i18n
                            return (
                                <List.Item key={blueprint.blueprintName}>
                                    <Label horizontal>{blueprint.blueprintName}</Label>{' '}
                                    <span>
                                        {i18n.t(
                                            'gettingStartedModal.summary.blueprintUploadedMessageSuffix',
                                            'blueprint is already uploaded'
                                        )}
                                    </span>
                                    <Icon
                                        style={{
                                            marginLeft: '0.5em',
                                            verticalAlign: 'middle',
                                            display: 'inline-block'
                                        }}
                                        color="green"
                                        name="check"
                                    />
                                </List.Item>
                            );
                        })}
                        {blueprintsInstallationTasks.tasks?.scheduledBlueprints.map(blueprint => {
                            // TODO: i18n
                            return (
                                <List.Item key={blueprint.blueprintName}>
                                    <Label horizontal>{blueprint.blueprintName}</Label>{' '}
                                    {i18n.t('gettingStartedModal.summary.blueprintUploadMessageSuffix')}
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
