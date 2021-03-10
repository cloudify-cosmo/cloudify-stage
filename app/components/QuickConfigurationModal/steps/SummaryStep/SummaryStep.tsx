import React, { memo, useEffect, useState } from 'react';
import { Divider, Form, Header, Label, List, Message, Progress } from 'semantic-ui-react';
import useCurrentCallback from '../../common/useCurrentCallback';
import { createResourcesInstaller } from '../../installationProcessUtils';
import { usePluginInstallationTasks, useSecretsInstallationTasks } from '../../installationTasksUtils';
import { useInternal, useManager } from '../../managerHooks';
import { JSONData, JSONSchema } from '../../model';
import PluginTaskItems, { installedPluginDescription, rejectedPluginDescription } from './PluginTaskItems';

type Props = {
    installationMode?: boolean;
    selectedPlugins: JSONSchema;
    typedSecrets: JSONData;
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
            // async installation that can be stopped with destroy method
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
        <Form
            style={{ minHeight: '150px' }}
            loading={pluginInstallationTasks.loading || secretInstallationTasks.loading}
        >
            {pluginInstallationTasks.error && secretInstallationTasks.error && (
                <Message color="red">
                    {pluginInstallationTasks.error && <p>{pluginInstallationTasks.error}</p>}
                    {secretInstallationTasks.error && <p>{secretInstallationTasks.error}</p>}
                </Message>
            )}
            {pluginInstallationTasks.tasks && secretInstallationTasks.tasks && (
                <>
                    <Header as="h4">Task list</Header>
                    <List ordered relaxed>
                        <PluginTaskItems
                            tasks={pluginInstallationTasks.tasks.installedPlugins}
                            description={installedPluginDescription}
                        />
                        <PluginTaskItems
                            tasks={pluginInstallationTasks.tasks.scheduledPlugins}
                            description="plugin will be installed"
                        />
                        <PluginTaskItems
                            tasks={pluginInstallationTasks.tasks.rejectedPlugins}
                            description={rejectedPluginDescription}
                        />
                        {secretInstallationTasks.tasks.createdSecrets.map(createdSecret => {
                            return (
                                <List.Item key={createdSecret.name}>
                                    <Label horizontal>{createdSecret.name}</Label> secret will be created
                                </List.Item>
                            );
                        })}
                        {secretInstallationTasks.tasks.updatedSecrets.map(updatedSecret => {
                            return (
                                <List.Item key={updatedSecret.name}>
                                    <Label horizontal>{updatedSecret.name}</Label> secret will be updated
                                </List.Item>
                            );
                        })}
                    </List>
                    {installationProgress !== undefined && (
                        <>
                            <Divider hidden />
                            <Progress progress size="large" percent={installationProgress} indicating>
                                {installationProgress < 100 ? 'Installation in progress...' : 'Installation done!'}
                            </Progress>
                        </>
                    )}
                </>
            )}
        </Form>
    );
};

export default memo(SummaryStep);
