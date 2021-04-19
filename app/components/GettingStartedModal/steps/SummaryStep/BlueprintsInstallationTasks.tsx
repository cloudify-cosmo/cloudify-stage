import i18n from 'i18next';
import React from 'react';

import { Divider, Label, List } from '../../../basic';
import { SuccessIcon } from '../../common/icons';

import type { createBlueprintsInstallationTasks } from '../../installation/tasks';

type Props = {
    tasks?: ReturnType<typeof createBlueprintsInstallationTasks>;
};

const BlueprintsInstallationTasks = ({ tasks }: Props) => {
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
                        <span>{i18n.t('gettingStartedModal.summary.blueprintExistsMessageSuffix')}</span>
                        <SuccessIcon />
                    </List.Item>
                );
            })}
            {tasks.scheduledBlueprints.map(blueprint => {
                return (
                    <List.Item key={blueprint.blueprintName}>
                        <Label horizontal>{blueprint.blueprintName}</Label>{' '}
                        {i18n.t('gettingStartedModal.summary.blueprintUploadMessageSuffix')}
                    </List.Item>
                );
            })}
        </>
    );
};

export default BlueprintsInstallationTasks;
