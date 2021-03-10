import React from 'react';
import { Icon } from 'semantic-ui-react';
import { PluginInstallationTask } from '../../installationTasksUtils';
import PluginTaskItem from './PluginTaskItem';

export const installedPluginDescription = (
    <>
        <span>plugin is already installed</span>
        <Icon
            style={{ marginLeft: '0.5em', verticalAlign: 'middle', display: 'inline-block' }}
            color="green"
            name="check"
        />
    </>
);

export const rejectedPluginDescription = (
    <>
        <span>plugin is not found in catalog and manager</span>
        <Icon
            style={{ marginLeft: '0.5em', verticalAlign: 'middle', display: 'inline-block' }}
            color="red"
            name="remove"
        />
    </>
);

type Props = {
    tasks?: PluginInstallationTask[];
    description: string | JSX.Element;
};

const PluginTaskItems = ({ tasks, description }: Props) => (
    <>
        {tasks?.map(task => {
            return <PluginTaskItem key={task.name} icon={task.icon} name={task.name} description={description} />;
        })}
    </>
);

export default PluginTaskItems;
