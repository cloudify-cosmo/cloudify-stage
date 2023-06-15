import React from 'react';
import StageUtils from '../../../utils/stageUtils';
import { Button, Modal } from '../../basic';

const translate = StageUtils.getT('gettingStartedModal');

interface GettingStartedErrorModalProps {
    onClose: () => void;
}

const GettingStartedErrorModal = ({ onClose }: GettingStartedErrorModalProps) => {
    return (
        <Modal open>
            <Modal.Header>{translate('errorModal.title')}</Modal.Header>
            <Modal.Content>{translate('errorModal.description')}</Modal.Content>
            <Modal.Actions>
                <Button content={translate('errorModal.close')} onClick={onClose} />
            </Modal.Actions>
        </Modal>
    );
};

export default GettingStartedErrorModal;
