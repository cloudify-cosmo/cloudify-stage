import i18n from 'i18next';
import React from 'react';

import createTaskDescriptionGetter from './createTaskDescriptionGetter';
import { Divider, Label, List } from '../../../basic';

import type { createSecretsInstallationTasks } from '../../installation/tasks';
import type { TaskStatus } from '../../installation/process';

type Props = {
    tasks?: ReturnType<typeof createSecretsInstallationTasks>;
    statuses?: Record<string, TaskStatus>;
};

const SecretsInstallationTasks = ({ tasks, statuses }: Props) => {
    if (tasks == null || (_.isEmpty(tasks.createdSecrets) && _.isEmpty(tasks.updatedSecrets))) {
        return null;
    }
    const getSecretTaskDescription = createTaskDescriptionGetter(
        i18n.t('gettingStartedModal.summary.secret.settingProgressMessageSuffix'),
        i18n.t('gettingStartedModal.summary.secret.settingDoneMessageSuffix'),
        i18n.t('gettingStartedModal.summary.secret.settingErrorMessageSuffix')
    );
    return (
        <>
            <Divider hidden style={{ margin: '0.5rem 0' }} />
            {tasks.createdSecrets.map(createdSecret => {
                return (
                    <List.Item key={createdSecret.name}>
                        <Label horizontal>{createdSecret.name}</Label>{' '}
                        {getSecretTaskDescription(
                            createdSecret.name,
                            statuses,
                            i18n.t('gettingStartedModal.summary.secret.creationScheduledMessageSuffix')
                        )}
                    </List.Item>
                );
            })}
            {tasks.updatedSecrets.map(updatedSecret => {
                return (
                    <List.Item key={updatedSecret.name}>
                        <Label horizontal>{updatedSecret.name}</Label>{' '}
                        {getSecretTaskDescription(
                            updatedSecret.name,
                            statuses,
                            i18n.t('gettingStartedModal.summary.secret.updateScheduledMessageSuffix')
                        )}
                    </List.Item>
                );
            })}
        </>
    );
};

export default SecretsInstallationTasks;
