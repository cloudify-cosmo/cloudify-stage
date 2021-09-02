import React from 'react';

import StageUtils from '../../utils/stageUtils';
import { Modal } from '../basic';
import { GettingStartedSchemaItem, StepName } from './model';

const t = StageUtils.getT('gettingStartedModal.titles');

type Props = {
    stepName: StepName;
    secretsStepsSchemas: GettingStartedSchemaItem[];
    secretsStepIndex: number;
};

const headerContentKeys = {
    [StepName.Technologies]: 'technologiesStep',
    [StepName.Summary]: 'summaryStep',
    [StepName.Status]: 'statusStep'
};

const ModalHeader = ({ stepName, secretsStepsSchemas, secretsStepIndex }: Props) => {
    if (stepName === StepName.Welcome) {
        return null;
    }

    let modalTitle;

    if (stepName === StepName.Secrets) {
        const schemaItem = secretsStepsSchemas[secretsStepIndex];
        modalTitle = schemaItem ? `${schemaItem.label} ${t('secretsStep')}` : '';
    } else {
        modalTitle = t(headerContentKeys[stepName]);
    }

    return <Modal.Header>{modalTitle}</Modal.Header>;
};

export default ModalHeader;
