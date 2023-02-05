import React from 'react';
import StageUtils from '../../../utils/stageUtils';
import { Button, Modal } from '../../basic';

const t = StageUtils.getT('gettingStartedModal');

interface GettingStartedErrorModalProps {
    onClose: () => void;
}

const GettingStartedErrorModal = ({ onClose }: GettingStartedErrorModalProps) => {
    return (
        <Modal open>
            <Modal.Header>{t('errorModal.title')}</Modal.Header>
            <Modal.Content>
                {t('errorModal.description')} {/* Todo: add loader icon */}
            </Modal.Content>
            <Modal.Actions>
                <Button content={t('errorModal.close')} onClick={onClose} />
            </Modal.Actions>
        </Modal>
    );
};

export default GettingStartedErrorModal;
