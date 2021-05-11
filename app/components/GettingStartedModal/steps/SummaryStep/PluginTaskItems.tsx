import React from 'react';
import i18n from 'i18next';

import type { ReactNode } from 'react';

import PluginTaskItem from './PluginTaskItem';
import createTaskDescriptionGetter from './createTaskDescriptionGetter';
import { ErrorDescription, SuccessDescription } from './descriptions';

import type { PluginInstallationTask } from '../../installation/tasks';

export const PluginExistsDescription = () => (
    <SuccessDescription message={i18n.t('gettingStartedModal.summary.plugin.alreadyInstalledMessageSuffix')} />
);

export const RejectedPluginDescription = () => (
    <ErrorDescription message={i18n.t('gettingStartedModal.summary.plugin.notFoundMessageSuffix')} />
);

type Props = {
    tasks?: PluginInstallationTask[];
    statuses?: Record<string, string>;
    description: string | ReactNode;
};

const PluginTaskItems = ({ tasks, statuses, description }: Props) => {
    const getPluginTaskDescription = createTaskDescriptionGetter(
        i18n.t('gettingStartedModal.summary.plugin.installationProgressMessageSuffix'),
        i18n.t('gettingStartedModal.summary.plugin.installationDoneMessageSuffix'),
        i18n.t('gettingStartedModal.summary.plugin.installationErrorMessageSuffix')
    );
    return (
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
};

export default PluginTaskItems;
