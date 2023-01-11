import React from 'react';
import StageUtils from '../../utils/stageUtils';
import { Button, Modal } from '../basic';

const t = StageUtils.getT('gettingStartedModal');

interface GettingStartedErrorModalProps {
    clearError: () => void;
}

const GettingStartedErrorModal = ({ clearError }: GettingStartedErrorModalProps) => {
    return (
        <Modal open>
            <Modal.Header>{t('errorModal.title')}</Modal.Header>
            <Modal.Content>{t('errorModal.description')}</Modal.Content>
            <Modal.Actions>
                <Button content="Close" onClick={clearError} />
            </Modal.Actions>
        </Modal>
    );
};

export default GettingStartedErrorModal;
