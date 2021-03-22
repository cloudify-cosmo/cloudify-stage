import React from 'react';
import PluginTaskItem from './PluginTaskItem';

import { SuccessIcon, ErrorIcon } from '../../common/icons';

import type { PluginInstallationTask } from '../../installation/tasks';

export const installedPluginDescription = (
    <>
        <span>plugin is already installed</span>
        <SuccessIcon />
    </>
);

export const rejectedPluginDescription = (
    <>
        <span>plugin is not found in catalog and manager</span>
        <ErrorIcon />
    </>
);

type Props = {
    tasks?: PluginInstallationTask[];
    description: string | JSX.Element;
};

const PluginTaskItems = ({ tasks, description }: Props) => (
    <>
        {tasks?.map(task => {
            const taskName = task.version ? `${task.name} ${task.version}` : task.name;
            return <PluginTaskItem key={taskName} icon={task.icon} name={taskName} description={description} />;
        })}
    </>
);

export default PluginTaskItems;
