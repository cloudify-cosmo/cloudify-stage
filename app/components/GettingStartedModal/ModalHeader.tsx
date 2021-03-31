import React from 'react';
import i18n from 'i18next';

import { Modal } from '../basic';
import { GettingStartedSchemaItem, StepName } from './model';

type Props = {
    stepName: StepName;
    secretsStepsSchemas: GettingStartedSchemaItem[];
    secretsStepIndex: number;
};

const ModalHeader = ({ stepName, secretsStepsSchemas, secretsStepIndex }: Props) => {
    let modalTitle = '';
    switch (stepName) {
        case StepName.Technologies:
            modalTitle = i18n.t('gettingStartedModal.titles.technologiesStep');
            break;
        case StepName.Secrets: {
            const schemaItem = secretsStepsSchemas[secretsStepIndex];
            modalTitle = schemaItem ? `${schemaItem.label} ${i18n.t('gettingStartedModal.titles.secretsStep')}` : '';
            break;
        }
        case StepName.Summary:
            modalTitle = i18n.t('gettingStartedModal.titles.summaryStep');
            break;
        case StepName.Status:
            modalTitle = i18n.t('gettingStartedModal.titles.statusStep');
            break;
        default:
            modalTitle = '';
            break;
    }
    return <Modal.Header>{modalTitle}</Modal.Header>;
};

export default ModalHeader;
