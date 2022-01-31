import React from 'react';
import { useInputs } from '../../utils/hooks';
import { Form, Modal, UnsafelyTypedFormField, ApproveButton } from '../basic';
import useModalOpenState from './useModalOpenState';

const textFormFields = [
    {
        name: 'firstName',
        label: 'First name',
        isRequired: true
    },
    {
        name: 'lastName',
        label: 'Last name',
        isRequired: true
    },
    {
        name: 'email',
        label: 'Email address',
        isRequired: false
    },
    {
        name: 'phone',
        label: 'Phone number',
        isRequired: false
    }
];

const checkboxFormFields = [
    {
        name: 'isEULA',
        label:
            'By registering for the Cloudify Hosted Service you agree to the Hosted Trial End User License Agreement.',
        isRequired: true
    },
    {
        name: 'isSendServicesDetails',
        label:
            'Cloudify uses the information provided to send you your service details. For more information see our Privacy Policy.',
        isRequired: false
    }
];

interface FormInputs {
    [inputName: string]: string | boolean;
}

const ContactDetailsModal = () => {
    const [formInputs, setFormInputs] = useInputs<FormInputs>({});
    const { isModalOpen } = useModalOpenState();

    const handleSubmit = () => {
        // eslint-disable-next-line
        console.log(formInputs);
    };

    return (
        <Modal open={isModalOpen}>
            <Modal.Header>Welcome to Cloudify</Modal.Header>
            <Modal.Content>
                <Form>
                    {textFormFields.map(contactField => (
                        <UnsafelyTypedFormField key={contactField.name}>
                            <Form.Input
                                type="text"
                                name={contactField.name}
                                label={contactField.label}
                                value={formInputs[contactField.name]}
                                onChange={setFormInputs}
                                required={contactField.isRequired}
                            />
                        </UnsafelyTypedFormField>
                    ))}
                    {checkboxFormFields.map(contactField => (
                        <UnsafelyTypedFormField key={contactField.name}>
                            <Form.Checkbox
                                name={contactField.name}
                                label={contactField.label}
                                help=""
                                checked={formInputs[contactField.name]}
                                onChange={setFormInputs}
                                required={contactField.isRequired}
                            />
                        </UnsafelyTypedFormField>
                    ))}
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <ApproveButton color="green" onClick={handleSubmit}>
                    Submit
                </ApproveButton>
            </Modal.Actions>
        </Modal>
    );
};

export default ContactDetailsModal;
