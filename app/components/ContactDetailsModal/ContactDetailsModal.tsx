import React from 'react';
import { useErrors, useInputs } from '../../utils/hooks';
import { Form, Modal, UnsafelyTypedFormField, ApproveButton } from '../basic';
import useModalOpenState from './useModalOpenState';

enum FormFieldType {
    Text,
    Checkbox
}

interface FormFieldValidation {
    regexp: RegExp;
    errorMessage: string;
}

interface FormField {
    name: string;
    label: string;
    isRequired?: boolean;
    type: FormFieldType;
    validation?: FormFieldValidation;
}

const formFields: FormField[] = [
    {
        name: 'firstName',
        label: 'First name',
        isRequired: true,
        type: FormFieldType.Text,
        validation: {
            errorMessage: 'Should be between 2 and 20 characters',
            regexp: /^(.){2,20}$/
        }
    },
    {
        name: 'lastName',
        label: 'Last name',
        isRequired: true,
        type: FormFieldType.Text,
        validation: {
            errorMessage: 'Should be between 2 and 20 characters',
            regexp: /^(.){2,20}$/
        }
    },
    {
        name: 'email',
        label: 'Email address',
        isRequired: true,
        type: FormFieldType.Text,
        validation: {
            errorMessage: 'Should be a valid email address',
            regexp: /^\S+@\S+\.\S+$/
        }
    },
    {
        name: 'phone',
        label: 'Phone number',
        isRequired: true,
        type: FormFieldType.Text,
        validation: {
            errorMessage: 'Should be between 4 and 20 digits',
            regexp: /^(\d){4,20}$/
        }
    },
    {
        name: 'isEULA',
        label:
            'By registering for the Cloudify Hosted Service you agree to the Hosted Trial End User License Agreement.',
        isRequired: true,
        type: FormFieldType.Checkbox
    },
    {
        name: 'isSendServicesDetails',
        label:
            'Cloudify uses the information provided to send you your service details. For more information see our Privacy Policy.',
        type: FormFieldType.Checkbox
    }
];

const requiredFormFields = formFields.filter(formField => formField.isRequired);

type FormFieldValue = string | boolean;

interface FormInputs {
    [inputName: string]: FormFieldValue;
}

const ContactDetailsModal = () => {
    const [formInputs, setFormInputs] = useInputs<FormInputs>({});
    const { errors, setErrors, clearErrors } = useErrors();
    const { isModalOpen } = useModalOpenState();

    const isFieldEmpty = (formField: FormField) => {
        const fieldValue = formInputs[formField.name];
        if (formField.type === FormFieldType.Text) {
            return _.isEmpty(fieldValue);
        }

        return !fieldValue;
    };

    const isFieldValid = (formField: FormField) => {
        const fieldValue = formInputs[formField.name] as string;
        const shouldBeValidated = !!formField.validation;

        if (shouldBeValidated) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return formField.validation!.regexp.test(fieldValue);
        }

        return true;
    };

    const validateFields = () => {
        const validationErrors: Record<string, unknown> = {};

        requiredFormFields.forEach(formField => {
            if (formField.isRequired && isFieldEmpty(formField)) {
                validationErrors[formField.name] = `${formField.label} - field is required.`;
            } else if (!isFieldValid(formField)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                validationErrors[formField.name] = `${formField.label} - ${formField.validation!.errorMessage}`;
            }
        });

        setErrors(validationErrors);
    };

    const handleSubmit = () => {
        validateFields();
        // eslint-disable-next-line
        console.log(formInputs);
    };

    return (
        <Modal open={isModalOpen}>
            <Modal.Header>Welcome to Cloudify</Modal.Header>
            <Modal.Content>
                <Form errors={errors} onErrorsDismiss={clearErrors}>
                    {formFields.map(formField => (
                        <UnsafelyTypedFormField key={formField.name}>
                            {formField.type === FormFieldType.Text ? (
                                <Form.Input
                                    type="text"
                                    name={formField.name}
                                    label={formField.label}
                                    value={formInputs[formField.name]}
                                    onChange={setFormInputs}
                                    required={formField.isRequired}
                                />
                            ) : (
                                <Form.Checkbox
                                    name={formField.name}
                                    label={formField.label}
                                    help=""
                                    checked={formInputs[formField.name]}
                                    onChange={setFormInputs}
                                />
                            )}
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
