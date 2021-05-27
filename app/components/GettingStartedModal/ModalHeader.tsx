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

const ModalHeader = ({ stepName, secretsStepsSchemas, secretsStepIndex }: Props) => {
    let modalTitle = '';
    switch (stepName) {
        case StepName.Technologies:
            modalTitle = t('technologiesStep');
            break;
        case StepName.Secrets: {
            const schemaItem = secretsStepsSchemas[secretsStepIndex];
            modalTitle = schemaItem ? `${schemaItem.label} ${t('secretsStep')}` : '';
            break;
        }
        case StepName.Summary:
            modalTitle = t('summaryStep');
            break;
        case StepName.Status:
            modalTitle = t('statusStep');
            break;
        default:
            modalTitle = '';
            break;
    }
    return <Modal.Header>{modalTitle}</Modal.Header>;
};

export default ModalHeader;
