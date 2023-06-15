import React from 'react';

import StageUtils from '../../../utils/stageUtils';
import { Button, Modal } from '../../basic';
import { StepName } from './model';

const translate = StageUtils.getT('gettingStartedModal.buttons');

type Props = {
    stepName: StepName;
    installationProcessing: boolean;
    onBackClick: () => void;
    onNextClick: () => void;
    onModalClose: () => void;
    nextButtonDisabled: boolean;
};

const ModalActions = ({
    stepName,
    nextButtonDisabled,
    installationProcessing,
    onBackClick,
    onNextClick,
    onModalClose
}: Props) => {
    const statusStepActive = stepName === StepName.Status;

    return (
        <Modal.Actions style={{ minHeight: 60 }}>
            {stepName !== StepName.Welcome && (
                <Button
                    icon="cancel"
                    content={translate('closeModal')}
                    floated="left"
                    disabled={installationProcessing}
                    labelPosition="left"
                    onClick={onModalClose}
                />
            )}
            {!statusStepActive && (
                <Button.Group floated="right">
                    {stepName && (
                        <Button
                            icon="left arrow"
                            content={translate('stepBack')}
                            labelPosition="left"
                            onClick={onBackClick}
                        />
                    )}
                    <Button
                        icon="right arrow"
                        content={stepName === StepName.Summary ? translate('stepFinish') : translate('stepNext')}
                        labelPosition="right"
                        onClick={onNextClick}
                        disabled={nextButtonDisabled}
                    />
                </Button.Group>
            )}
        </Modal.Actions>
    );
};

export default ModalActions;
