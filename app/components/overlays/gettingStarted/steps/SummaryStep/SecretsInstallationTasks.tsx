import React from 'react';

import StageUtils from '../../../../../utils/stageUtils';
import { createSecretTaskDescriptionGetter } from './descriptionGetters';
import { Divider, Label, List } from '../../../../basic';

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
    const getSecretTaskDescription = createSecretTaskDescriptionGetter(
        t('settingProgressMessageSuffix'),
        t('settingDoneMessageSuffix'),
        t('settingErrorMessageSuffix'),
        t('skipScheduledMessageSufix')
    );
    return (
        <>
            <Divider hidden style={{ margin: '0.5rem 0' }} />
            {tasks.createdSecrets.map(createdSecret => {
                return (
                    <List.Item key={createdSecret.name}>
                        <Label horizontal>{createdSecret.name}</Label>{' '}
                        {getSecretTaskDescription(createdSecret, statuses, t('creationScheduledMessageSuffix'))}
                    </List.Item>
                );
            })}
            {tasks.updatedSecrets.map(updatedSecret => {
                return (
                    <List.Item key={updatedSecret.name}>
                        <Label horizontal>{updatedSecret.name}</Label>{' '}
                        {getSecretTaskDescription(updatedSecret, statuses, t('updateScheduledMessageSuffix'))}
                    </List.Item>
                );
            })}
        </>
    );
};

export default SecretsInstallationTasks;
