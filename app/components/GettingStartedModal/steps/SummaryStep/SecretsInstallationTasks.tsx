import i18n from 'i18next';
import React from 'react';

import { Divider, Label, List } from '../../../basic';

import type { createSecretsInstallationTasks } from '../../installation/tasks';

type Props = {
    tasks: ReturnType<typeof createSecretsInstallationTasks>
};

const SecretsInstallationTasks = ({ tasks }: Props) => {
    if (_.isEmpty(tasks.createdSecrets) && _.isEmpty(tasks.updatedSecrets)) {
        return null;
    }
    return (
        <>
            <Divider hidden style={{ margin: '0.5rem 0' }} />
            {tasks.createdSecrets.map(createdSecret => {
                return (
                    <List.Item key={createdSecret.name}>
                        <Label horizontal>{createdSecret.name}</Label>{' '}
                        {i18n.t('gettingStartedModal.summary.secretCreateMessageSuffix', 'secret will be created')}
                    </List.Item>
                );
            })}
            {tasks.updatedSecrets.map(updatedSecret => {
                return (
                    <List.Item key={updatedSecret.name}>
                        <Label horizontal>{updatedSecret.name}</Label>{' '}
                        {i18n.t('gettingStartedModal.summary.secretUpdateMessageSuffix', 'secret will be updated')}
                    </List.Item>
                );
            })}
        </>
    );
};

export default SecretsInstallationTasks;
