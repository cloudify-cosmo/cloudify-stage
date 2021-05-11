import React from 'react';
import i18n from 'i18next';

import type { ReactNode } from 'react';

import PluginTaskItem from './PluginTaskItem';

import type { PluginInstallationTask } from '../../installation/tasks';
import { ErrorDescription, ProcessingDescription, SuccessDescription } from './descriptions';

export const PluginExistsDescription = () => (
    <SuccessDescription message={i18n.t('gettingStartedModal.summary.pluginExistsMessageSuffix')} />
);

export const RejectedPluginDescription = () => (
    <ErrorDescription message={i18n.t('gettingStartedModal.summary.pluginNotFoundMessageSuffix')} />
);

const getPluginTaskDescription = (
    taskName: string,
    taskStatuses?: Record<string, string>,
    defaultDescription?: ReactNode
) => {
    switch (taskStatuses?.[taskName]) {
        case 'installation-progress':
            return (
                <ProcessingDescription
                    message={i18n.t('gettingStartedModal.summary.pluginInstallationProgressMessageSuffix')}
                />
            );
        case 'installation-done':
            return (
                <SuccessDescription
                    message={i18n.t('gettingStartedModal.summary.pluginInstallationDoneMessageSuffix')}
                />
            );
        case 'installation-error':
            return (
                <ErrorDescription
                    message={i18n.t('gettingStartedModal.summary.pluginInstallationErrorMessageSuffix')}
                />
            );
        default:
            return defaultDescription;
    }
};

type Props = {
    tasks?: PluginInstallationTask[];
    statuses?: Record<string, string>;
    description: string | ReactNode;
};

const PluginTaskItems = ({ tasks, statuses, description }: Props) => (
    <>
        {tasks?.map(task => {
            const taskName = task.version ? `${task.name} ${task.version}` : task.name;
            return (
                <PluginTaskItem
                    key={taskName}
                    icon={task.icon}
                    name={taskName}
                    description={getPluginTaskDescription(task.name, statuses, description)}
                />
            );
        })}
    </>
);

export default PluginTaskItems;
