import i18n from 'i18next';
import React, { memo, useEffect, useState } from 'react';
import { Divider, Form, Header, Label, List, Message, Progress, Icon } from 'semantic-ui-react';
import useCurrentCallback from '../../common/useCurrentCallback';
import { createResourcesInstaller } from '../../installation/process';
import {
    useBlueprintsInstallationTasks,
    usePluginsInstallationTasks,
    useSecretsInstallationTasks
} from '../../installation/tasks';
import { useInternal, useManager } from '../../managerHooks';
import PluginTaskItems, { installedPluginDescription, rejectedPluginDescription } from './PluginTaskItems';

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

    return (
        <Form
            style={{ minHeight: '150px' }}
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
            {pluginsInstallationTasks.tasks && secretsInstallationTasks.tasks && blueprintsInstallationTasks.tasks && (
                <>
                    <Header as="h4">{i18n.t('gettingStartedModal.summary.taskListTitle', 'Task List')}</Header>
                    <List ordered relaxed>
                        <PluginTaskItems
                            tasks={pluginsInstallationTasks.tasks.installedPlugins}
                            description={installedPluginDescription}
                        />
                        <PluginTaskItems
                            tasks={pluginsInstallationTasks.tasks.scheduledPlugins}
                            description={i18n.t(
                                'gettingStartedModal.summary.pluginInstallMessageSuffix',
                                'plugin will be installed.'
                            )}
                        />
                        <PluginTaskItems
                            tasks={pluginsInstallationTasks.tasks.rejectedPlugins}
                            description={rejectedPluginDescription}
                        />
                        {secretsInstallationTasks.tasks.createdSecrets.map(createdSecret => {
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
                        {secretsInstallationTasks.tasks.updatedSecrets.map(updatedSecret => {
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
                        {blueprintsInstallationTasks.tasks.uploadedBlueprints.map(blueprint => {
                            return (
                                <List.Item key={blueprint.blueprintName}>
                                    <Label horizontal>{blueprint.blueprintName}</Label>{' '}
                                    <span>
                                        {i18n.t(
                                            'gettingStartedModal.summary.blueprintReadyMessageSuffix',
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
                        {blueprintsInstallationTasks.tasks.scheduledBlueprints.map(blueprint => {
                            return (
                                <List.Item key={blueprint.blueprintName}>
                                    <Label horizontal>{blueprint.blueprintName}</Label>{' '}
                                    {i18n.t(
                                        'gettingStartedModal.summary.blueprintUploadMessageSuffix',
                                        'blueprint will be uploaded'
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
        </Form>
    );
};

export default memo(SummaryStep);
