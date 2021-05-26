import React from 'react';

import StageUtils from '../../../../utils/stageUtils';
import createTaskDescriptionGetter from './createTaskDescriptionGetter';
import { Divider, Label, List } from '../../../basic';

import type { createSecretsInstallationTasks } from '../../installation/tasks';
import type { TaskStatus } from '../../installation/process';

const t = StageUtils.getT('gettingStartedModal.summary.secret');

type Props = {
    tasks?: ReturnType<typeof createSecretsInstallationTasks>;
    statuses?: Record<string, TaskStatus>;
};

const SecretsInstallationTasks = ({ tasks, statuses }: Props) => {
    if (tasks == null || (_.isEmpty(tasks.createdSecrets) && _.isEmpty(tasks.updatedSecrets))) {
        return null;
    }
    const getSecretTaskDescription = createTaskDescriptionGetter(
        t('settingProgressMessageSuffix'),
        t('settingDoneMessageSuffix'),
        t('settingErrorMessageSuffix')
    );
    return (
        <>
            <Divider hidden style={{ margin: '0.5rem 0' }} />
            {tasks.createdSecrets.map(createdSecret => {
                return (
                    <List.Item key={createdSecret.name}>
                        <Label horizontal>{createdSecret.name}</Label>{' '}
                        {getSecretTaskDescription(createdSecret.name, statuses, t('creationScheduledMessageSuffix'))}
                    </List.Item>
                );
            })}
            {tasks.updatedSecrets.map(updatedSecret => {
                return (
                    <List.Item key={updatedSecret.name}>
                        <Label horizontal>{updatedSecret.name}</Label>{' '}
                        {getSecretTaskDescription(updatedSecret.name, statuses, t('updateScheduledMessageSuffix'))}
                    </List.Item>
                );
            })}
        </>
    );
};

export default SecretsInstallationTasks;
