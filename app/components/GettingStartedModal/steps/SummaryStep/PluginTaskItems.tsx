import React from 'react';
import i18n from 'i18next';

import PluginTaskItem from './PluginTaskItem';
import { SuccessIcon, ErrorIcon } from '../../common/icons';

import type { PluginInstallationTask } from '../../installation/tasks';

export const InstalledPluginDescription = () => (
    <>
        <span>{i18n.t('gettingStartedModal.summary.pluginInstalledMessageSuffix')}</span>
        <SuccessIcon />
    </>
);

export const RejectedPluginDescription = () => (
    <>
        <span>{i18n.t('gettingStartedModal.summary.pluginNotFoundMessageSuffix')}</span>
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
