import React, { ReactNode } from 'react';
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
            modalTitle = i18n.t('gettingStartedModal.titles.technologiesStep', 'Getting Started');
            break;
        case StepName.Secrets: {
            const schemaItem = secretsStepsSchemas[secretsStepIndex];
            modalTitle = schemaItem
                ? `${schemaItem.label} ${i18n.t('gettingStartedModal.titles.secretsStep', 'Secrets')}`
                : '';
            break;
        }
        case StepName.Summary:
            modalTitle = i18n.t('gettingStartedModal.titles.summaryStep', 'Summary');
            break;
        case StepName.Status:
            modalTitle = i18n.t('gettingStartedModal.titles.statusStep', 'Status');
            break;
        default:
            modalTitle = '';
            break;
    }
    return <Modal.Header>{modalTitle}</Modal.Header>;
};

export default ModalHeader;
