import React from 'react';

import StageUtils from '../../../../../utils/stageUtils';
import { Divider, Label, List } from '../../../../basic';
import { createTaskDescriptionGetter } from './descriptionGetters';
import { SuccessDescription } from './descriptions';

import type { createBlueprintsInstallationTasks } from '../../installation/tasks';
import type { TaskStatus } from '../../installation/process';

const translate = StageUtils.getT('gettingStartedModal.summary.blueprint');

type Props = {
    tasks?: ReturnType<typeof createBlueprintsInstallationTasks>;
    statuses?: Record<string, TaskStatus>;
};

const BlueprintsInstallationTasks = ({ tasks, statuses }: Props) => {
    if (tasks == null || (_.isEmpty(tasks.uploadedBlueprints) && _.isEmpty(tasks.scheduledBlueprints))) {
        return null;
    }
    const getBlueprintTaskDescription = createTaskDescriptionGetter(
        translate('uploadingProgressMessageSuffix'),
        translate('uploadingDoneMessageSuffix'),
        translate('uploadingErrorMessageSuffix')
    );
    return (
        <>
            <Divider hidden style={{ margin: '0.5rem 0' }} />
            {tasks.uploadedBlueprints.map(blueprint => {
                return (
                    <List.Item key={blueprint.blueprintName}>
                        <Label horizontal>{blueprint.blueprintName}</Label>{' '}
                        <SuccessDescription message={translate('alreadyUploadedMessageSuffix')} />
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
                            translate('uploadScheduledMessageSuffix')
                        )}
                    </List.Item>
                );
            })}
        </>
    );
};

export default BlueprintsInstallationTasks;
