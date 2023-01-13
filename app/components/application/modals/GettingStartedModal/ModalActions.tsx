import React, { useMemo } from 'react';

import StageUtils from '../../../../utils/stageUtils';
import { Button, Modal } from '../../../basic';
import type { GettingStartedEnvironmentsData } from './model';
import { StepName } from './model';

const t = StageUtils.getT('gettingStartedModal.buttons');

type Props = {
    stepName: StepName;
    installationProcessing: boolean;
    onBackClick: () => void;
    onNextClick: () => void;
    onModalClose: () => void;
    environmentsStepData: GettingStartedEnvironmentsData;
};

const ModalActions = ({
    stepName,
    installationProcessing,
    environmentsStepData,
    onBackClick,
    onNextClick,
    onModalClose
}: Props) => {
    const statusStepActive = stepName === StepName.Status;
    const disableNextButton = useMemo(() => {
        const isEnvironmentsStep = stepName === StepName.Environments;
        return isEnvironmentsStep;
    }, [stepName, environmentsStepData]);

    return (
        <Modal.Actions style={{ minHeight: 60 }}>
            {stepName !== StepName.Welcome && (
                <Button
                    icon="cancel"
                    content={t('closeModal')}
                    floated="left"
                    disabled={installationProcessing}
                    labelPosition="left"
                    onClick={onModalClose}
                />
            )}
            {!statusStepActive && (
                <Button.Group floated="right">
                    {stepName && (
                        <Button icon="left arrow" content={t('stepBack')} labelPosition="left" onClick={onBackClick} />
                    )}
                    <Button
                        icon="right arrow"
                        content={stepName === StepName.Summary ? t('stepFinish') : t('stepNext')}
                        labelPosition="right"
                        onClick={onNextClick}
                        disabled={disableNextButton}
                    />
                </Button.Group>
            )}
        </Modal.Actions>
    );
};

export default ModalActions;
