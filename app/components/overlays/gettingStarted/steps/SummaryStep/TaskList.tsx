import React from 'react';
import i18n from 'i18next';
import type { FunctionComponent } from 'react';

import { Header, List } from '../../../../basic';
import PluginsInstallationTasks from './PluginsInstallationTasks';
import SecretsInstallationTasks from './SecretsInstallationTasks';
import BlueprintsInstallationTasks from './BlueprintsInstallationTasks';
import type { TaskStatus, TaskType } from '../../installation/process';
import type {
    createBlueprintsInstallationTasks,
    createPluginInstallationTasks,
    createSecretsInstallationTasks
} from '../../installation/tasks';

interface TaskListProps {
    installationStatuses: Record<TaskType, Record<string, TaskStatus>>;
    pluginsTasks?: ReturnType<typeof createPluginInstallationTasks>;
    secretsTasks?: ReturnType<typeof createSecretsInstallationTasks>;
    blueprintsTasks?: ReturnType<typeof createBlueprintsInstallationTasks>;
}

const TaskList: FunctionComponent<TaskListProps> = ({
    installationStatuses,
    pluginsTasks,
    secretsTasks,
    blueprintsTasks
}) => {
    return (
        <>
            <Header as="h4">{i18n.t('gettingStartedModal.summary.taskListTitle')}</Header>
            <List relaxed style={{ margin: 0, flex: 1, overflow: 'auto' }}>
                <PluginsInstallationTasks tasks={pluginsTasks} statuses={installationStatuses.plugin} />
                <SecretsInstallationTasks tasks={secretsTasks} statuses={installationStatuses.secret} />
                <BlueprintsInstallationTasks tasks={blueprintsTasks} statuses={installationStatuses.blueprint} />
            </List>
        </>
    );
};

export default TaskList;
