import React from 'react';

import type { ReactNode } from 'react';

import StageUtils from '../../../../../utils/stageUtils';
import PluginTaskItem from './PluginTaskItem';
import { createTaskDescriptionGetter } from './descriptionGetters';
import { ErrorDescription, SuccessDescription } from './descriptions';

import type { PluginInstallationTask } from '../../installation/tasks';
import type { TaskStatus } from '../../installation/process';

const translate = StageUtils.getT('gettingStartedModal.summary.plugin');

export const PluginExistsDescription = () => (
    <SuccessDescription message={translate('alreadyInstalledMessageSuffix')} />
);
export const RejectedPluginDescription = () => <ErrorDescription message={translate('notFoundMessageSuffix')} />;

type Props = {
    tasks?: PluginInstallationTask[];
    statuses?: Record<string, TaskStatus>;
    description: string | ReactNode;
};

const PluginTaskItems = ({ tasks, statuses, description }: Props) => {
    const getPluginTaskDescription = createTaskDescriptionGetter(
        translate('installationProgressMessageSuffix'),
        translate('installationDoneMessageSuffix'),
        translate('installationErrorMessageSuffix')
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
