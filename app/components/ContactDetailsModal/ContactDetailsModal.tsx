import React from 'react';
import { Modal } from '../basic';
import ContactDetailsForm from './ContactDetailsForm';
import useModalOpenState from './useModalOpenState';

const ContactDetailsModal = () => {
    const { isModalOpen } = useModalOpenState();

    return (
        <Modal open={isModalOpen}>
            <Modal.Header>Welcome to Cloudify</Modal.Header>
            <ContactDetailsForm />
        </Modal>
    );
};

export default ContactDetailsModal;
