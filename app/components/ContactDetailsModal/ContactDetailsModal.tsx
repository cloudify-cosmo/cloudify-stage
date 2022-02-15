import React from 'react';
import StageUtils from '../../utils/stageUtils';
import { Modal } from '../basic';
import ContactDetailsModalContent from './ContactDetailsModalContent';
import useModalOpenState from './useModalOpenState';

const t = StageUtils.getT('contactDetailsModal');

const ContactDetailsModal = () => {
    const { isModalOpen, closeModal } = useModalOpenState();

    return (
        <Modal open={isModalOpen}>
            <Modal.Header>{t('header')}</Modal.Header>
            <ContactDetailsModalContent closeModal={closeModal} />
        </Modal>
    );
};

export default ContactDetailsModal;
