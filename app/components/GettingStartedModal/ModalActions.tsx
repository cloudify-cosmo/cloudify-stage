import React from 'react';
import i18n from 'i18next';

import { Button, Modal } from '../basic';
import { StepName } from './model';

type Props = {
    stepName: StepName;
    installationProcessing: boolean;
    onBackClick: () => void;
    onNextClick: () => void;
    onModalClose: () => void;
};

const ModalActions = ({ stepName, installationProcessing, onBackClick, onNextClick, onModalClose }: Props) => {
    const statusStepActive = stepName === StepName.Status;
    return (
        <Modal.Actions style={{ minHeight: 60 }}>
            <Button
                icon="cancel"
                content={i18n.t('gettingStartedModal.buttons.closeModal')}
                floated="left"
                disabled={installationProcessing}
                labelPosition="left"
                onClick={onModalClose}
            />
            {!statusStepActive && (
                <Button.Group floated="right">
                    {stepName !== StepName.Technologies && (
                        <Button
                            icon="left arrow"
                            content={i18n.t('gettingStartedModal.buttons.stepBack')}
                            labelPosition="left"
                            onClick={onBackClick}
                        />
                    )}
                    <Button
                        icon="right arrow"
                        content={
                            stepName === StepName.Summary
                                ? i18n.t('gettingStartedModal.buttons.stepFinish')
                                : i18n.t('gettingStartedModal.buttons.stepNext')
                        }
                        labelPosition="right"
                        onClick={onNextClick}
                    />
                </Button.Group>
            )}
        </Modal.Actions>
    );
};

export default ModalActions;
