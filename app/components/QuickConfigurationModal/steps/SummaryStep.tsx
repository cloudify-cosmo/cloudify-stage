import React, { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Divider, Form, Header, Icon, Label, List, Message, Progress } from 'semantic-ui-react';
import { createToolbox } from '../../../utils/Toolbox';
import useCurrentCallback from '../common/useCurrentCallback';
import { PluginInstallationTask, usePluginInstallationTasks, useSecretsInstallationTasks } from '../installationUtils';
import { useInternal, useManager } from '../managerHooks';
import { JSONData, JSONSchema } from '../model';
import { URLString } from '../plugins/model';

type Props = {
    installationMode?: boolean;
    selectedPlugins: JSONSchema;
    typedSecrets: JSONData;
    onInstallationStarted?: () => void;
    onInstallationFinished?: () => void;
    onInstallationCanceled?: () => void;
};

type PluginTaskItemProps = {
    icon?: URLString;
    name: string;
    description: string | JSX.Element;
};

const PluginTaskItem = ({ icon, name, description }: PluginTaskItemProps) => {
    return (
        <List.Item>
            <Label horizontal>
                {icon && (
                    <img
                        style={{
                            minWidth: '1.5em',
                            maxHeight: '1.5em',
                            verticalAlign: 'middle'
                        }}
                        src={icon}
                        alt={name}
                    />
                )}
                <span style={{ marginLeft: '1em' }}>{name}</span>
            </Label>
            {description}
        </List.Item>
    );
};

type PluginTaskItemsProps = {
    tasks?: PluginInstallationTask[];
    description: string | JSX.Element;
};

const PluginTaskItems = ({ tasks, description }: PluginTaskItemsProps) => (
    <>
        {tasks?.map(task => {
            return <PluginTaskItem key={task.name} icon={task.icon} name={task.name} description={description} />;
        })}
    </>
);

const installedPluginDescription = (
    <>
        <span>plugin is already installed</span>
        <Icon
            style={{ marginLeft: '0.5em', verticalAlign: 'middle', display: 'inline-block' }}
            color="green"
            name="check"
        />
    </>
);

const rejectedPluginDescription = (
    <>
        <span>plugin is not found in catalog and manager</span>
        <Icon
            style={{ marginLeft: '0.5em', verticalAlign: 'middle', display: 'inline-block' }}
            color="red"
            name="remove"
        />
    </>
);

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
    const [installationProgress, setInstallationProgress] = useState<number>();

    useEffect(() => {
        if (installationMode && pluginInstallationTasks.tasks && secretInstallationTasks.tasks) {
            let componentMounted = true;
            let installationFinished = false;

            const { scheduledPlugins } = pluginInstallationTasks.tasks;
            const { updatedSecrets } = secretInstallationTasks.tasks;
            const { createdSecrets } = secretInstallationTasks.tasks;

            let stepIndex = 0;
            const stepsCount = scheduledPlugins.length + updatedSecrets.length + createdSecrets.length;

            (async () => {
                if (!componentMounted) {
                    return;
                }
                setInstallationProgress(0);
                handleInstallationStarted();
                for (const scheduledPlugin of scheduledPlugins) {
                    const params = {
                        visibility: 'tenant',
                        title: scheduledPlugin.name,
                        yamlUrl: scheduledPlugin.yamlUrl,
                        wagonUrl: scheduledPlugin.wagonUrl
                    };
                    try {
                        const response = await internal.doUpload('/plugins/upload', params, null, 'post');
                        if (!componentMounted) {
                            return;
                        }
                        // TODO: use response
                        console.log('response');
                    } catch (e) {
                        console.log('error');
                    } finally {
                        if (!componentMounted) {
                            return;
                        }
                        stepIndex += 1;
                        setInstallationProgress(Math.round(100 * (stepIndex / stepsCount)));
                    }
                }
                for (const updatedSecret of updatedSecrets) {
                    try {
                        const data = {
                            value: updatedSecret.value
                        };
                        const response = await manager.doPatch(`/secrets/${updatedSecret.name}`, null, data); // diff
                        if (!componentMounted) {
                            return;
                        }
                        // TODO: use response
                        console.log('response');
                    } catch (e) {
                        console.log('error');
                    } finally {
                        if (!componentMounted) {
                            return;
                        }
                        stepIndex += 1;
                        setInstallationProgress(Math.round(100 * (stepIndex / stepsCount)));
                    }
                }
                for (const createdSecret of createdSecrets) {
                    try {
                        const data = {
                            value: createdSecret.value,
                            visibility: 'tenant',
                            is_hidden_value: true
                        };
                        const response = await manager.doPut(`/secrets/${createdSecret.name}`, null, data); // diff
                        if (!componentMounted) {
                            return;
                        }
                        // TODO: use response
                        console.log('response');
                    } catch (e) {
                        console.log('error');
                    } finally {
                        if (!componentMounted) {
                            return;
                        }
                        stepIndex += 1;
                        setInstallationProgress(Math.round(100 * (stepIndex / stepsCount)));
                    }
                }
                installationFinished = true;
                setInstallationProgress(100);
                handleInstallationFinished();
            })();
            return () => {
                componentMounted = false;
                if (!installationFinished) {
                    handleInstallationCanceled();
                }
            };
        }
        setInstallationProgress(undefined);
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
