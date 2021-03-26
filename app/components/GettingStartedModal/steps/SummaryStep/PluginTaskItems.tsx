import React from 'react';
import i18n from 'i18next';

import { Icon } from '../../../basic';
import PluginTaskItem from './PluginTaskItem';

import type { PluginInstallationTask } from '../../installation/tasks';

export const installedPluginDescription = (
    <>
        <span>
            {i18n.t('gettingStartedModal.summary.pluginInstalledMessageSuffix', 'plugin is already installed.')}
        </span>
        <Icon
            style={{ marginLeft: '0.5em', verticalAlign: 'middle', display: 'inline-block' }}
            color="green"
            name="check"
        />
    </>
);

export const rejectedPluginDescription = (
    <>
        <span>
            {i18n.t(
                'gettingStartedModal.summary.pluginNotFoundMessageSuffix',
                'plugin is not found in catalog and manager.'
            )}
        </span>
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
            const taskName = task.version ? `${task.name} ${task.version}` : task.name;
            return <PluginTaskItem key={taskName} icon={task.icon} name={taskName} description={description} />;
        })}
    </>
);

export default PluginTaskItems;
