import React, { useMemo } from 'react';

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
    [StepName.Environments]: 'environmentsStep',
    [StepName.Summary]: 'summaryStep',
    [StepName.Status]: 'statusStep'
};

const ModalHeader = ({ stepName, secretsStepsSchemas, secretsStepIndex }: Props) => {
    const modalTitle = useMemo(() => {
        if (stepName === StepName.Welcome) {
            return null;
        }

        if (stepName === StepName.Secrets) {
            const schemaItem = secretsStepsSchemas[secretsStepIndex];
            return schemaItem ? `${schemaItem.label} ${t('secretsStep')}` : '';
        }

        return t(headerContentKeys[stepName]);
    }, [stepName, secretsStepIndex]);

    if (!modalTitle) return null;

    return <Modal.Header>{modalTitle}</Modal.Header>;
};

export default ModalHeader;
