import i18n from 'i18next';
import React from 'react';

import { Divider, Label, List } from '../../../basic';
import createTaskDescriptionGetter from './createTaskDescriptionGetter';
import { SuccessDescription } from './descriptions';

import type { createBlueprintsInstallationTasks } from '../../installation/tasks';

type Props = {
    tasks?: ReturnType<typeof createBlueprintsInstallationTasks>;
    statuses?: Record<string, string>;
};

const BlueprintsInstallationTasks = ({ tasks, statuses }: Props) => {
    if (tasks == null || (_.isEmpty(tasks.uploadedBlueprints) && _.isEmpty(tasks.scheduledBlueprints))) {
        return null;
    }
    const getBlueprintTaskDescription = createTaskDescriptionGetter(
        i18n.t('gettingStartedModal.summary.blueprint.uploadingProgressMessageSuffix'),
        i18n.t('gettingStartedModal.summary.blueprint.uploadingDoneMessageSuffix'),
        i18n.t('gettingStartedModal.summary.blueprint.uploadingErrorMessageSuffix')
    );
    return (
        <>
            <Divider hidden style={{ margin: '0.5rem 0' }} />
            {tasks.uploadedBlueprints.map(blueprint => {
                return (
                    <List.Item key={blueprint.blueprintName}>
                        <Label horizontal>{blueprint.blueprintName}</Label>{' '}
                        <SuccessDescription
                            message={i18n.t('gettingStartedModal.summary.blueprint.alreadyUploadedMessageSuffix')}
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
                            i18n.t('gettingStartedModal.summary.blueprint.uploadScheduledMessageSuffix')
                        )}
                    </List.Item>
                );
            })}
        </>
    );
};

export default BlueprintsInstallationTasks;
