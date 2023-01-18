import React, { useMemo } from 'react';

import StageUtils from '../../../utils/stageUtils';
import { Modal } from '../../basic';
import type { GettingStartedSchemaItem } from './model';
import { StepName } from './model';

const tModal = StageUtils.getT('gettingStartedModal');
const tTitle = StageUtils.composeT(tModal, 'titles');

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
            return schemaItem ? `${schemaItem.label} ${tTitle('secretsStep')}` : '';
        }

        return tTitle(headerContentKeys[stepName]);
    }, [stepName, secretsStepIndex]);

    if (!modalTitle) return null;

    return (
        <Modal.Header>
            {modalTitle}
            {stepName === StepName.Secrets && <div style={{ fontSize: '0.8em' }}>{tModal('secretsSubtitle')}</div>}
        </Modal.Header>
    );
};

export default ModalHeader;
