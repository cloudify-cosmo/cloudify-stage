import i18n from 'i18next';
import React from 'react';

import type { ReactNode } from 'react';

import { Divider, Label, List } from '../../../basic';
import { ErrorDescription, ProcessingDescription, SuccessDescription } from './descriptions';

import type { createBlueprintsInstallationTasks } from '../../installation/tasks';

const getBlueprintTaskDescription = (
    taskName: string,
    taskStatuses?: Record<string, string>,
    defaultDescription?: ReactNode
) => {
    switch (taskStatuses?.[taskName]) {
        case 'installation-progress':
            return (
                <ProcessingDescription
                    message={i18n.t('gettingStartedModal.summary.blueprintInstallationProgressMessageSuffix')}
                />
            );
        case 'installation-done':
            return (
                <SuccessDescription
                    message={i18n.t('gettingStartedModal.summary.blueprintInstallationDoneMessageSuffix')}
                />
            );
        case 'installation-error':
            return (
                <ErrorDescription
                    message={i18n.t('gettingStartedModal.summary.blueprintInstallationErrorMessageSuffix')}
                />
            );
        default:
            return defaultDescription;
    }
};

type Props = {
    tasks?: ReturnType<typeof createBlueprintsInstallationTasks>;
    statuses?: Record<string, string>;
};

const BlueprintsInstallationTasks = ({ tasks, statuses }: Props) => {
    if (tasks == null || (_.isEmpty(tasks.uploadedBlueprints) && _.isEmpty(tasks.scheduledBlueprints))) {
        return null;
    }
    return (
        <>
            <Divider hidden style={{ margin: '0.5rem 0' }} />
            {tasks.uploadedBlueprints.map(blueprint => {
                return (
                    <List.Item key={blueprint.blueprintName}>
                        <Label horizontal>{blueprint.blueprintName}</Label>{' '}
                        <SuccessDescription
                            message={i18n.t('gettingStartedModal.summary.blueprintExistsMessageSuffix')}
                        />
                    </List.Item>
                );
            })}
            {tasks.scheduledBlueprints.map(blueprint => {
                return (
                    <List.Item key={blueprint.blueprintName}>
                        <Label horizontal>{blueprint.blueprintName}</Label>{' '}
                        {getBlueprintTaskDescription(
                            blueprint.blueprintName,
                            statuses,
                            i18n.t('gettingStartedModal.summary.blueprintUploadMessageSuffix')
                        )}
                    </List.Item>
                );
            })}
        </>
    );
};

export default BlueprintsInstallationTasks;
