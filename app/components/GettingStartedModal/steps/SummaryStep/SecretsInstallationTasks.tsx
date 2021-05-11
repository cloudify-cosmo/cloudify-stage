import i18n from 'i18next';
import React from 'react';

import type { ReactNode } from 'react';

import { Divider, Label, List } from '../../../basic';
import { ErrorDescription, ProcessingDescription, SuccessDescription } from './descriptions';

import type { createSecretsInstallationTasks } from '../../installation/tasks';

const getSecretTaskDescription = (
    taskName: string,
    taskStatuses?: Record<string, string>,
    defaultDescription?: ReactNode
) => {
    switch (taskStatuses?.[taskName]) {
        case 'installation-progress':
            return (
                <ProcessingDescription
                    message={i18n.t('gettingStartedModal.summary.secretInstallationProgressMessageSuffix')}
                />
            );
        case 'installation-done':
            return (
                <SuccessDescription
                    message={i18n.t('gettingStartedModal.summary.secretInstallationDoneMessageSuffix')}
                />
            );
        case 'installation-error':
            return (
                <ErrorDescription
                    message={i18n.t('gettingStartedModal.summary.secretInstallationErrorMessageSuffix')}
                />
            );
        default:
            return defaultDescription;
    }
};

type Props = {
    tasks?: ReturnType<typeof createSecretsInstallationTasks>;
    statuses?: Record<string, string>;
};

const SecretsInstallationTasks = ({ tasks, statuses }: Props) => {
    if (tasks == null || (_.isEmpty(tasks.createdSecrets) && _.isEmpty(tasks.updatedSecrets))) {
        return null;
    }
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
                            i18n.t('gettingStartedModal.summary.secretCreateMessageSuffix')
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
                            i18n.t('gettingStartedModal.summary.secretUpdateMessageSuffix')
                        )}
                    </List.Item>
                );
            })}
        </>
    );
};

export default SecretsInstallationTasks;
