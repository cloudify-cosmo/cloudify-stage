import React from 'react';
import { useErrors, useInputs } from '../../../utils/hooks';
import { Modal, Form, UnsafelyTypedFormField, ApproveButton } from '../../basic';
import type { FormField } from './form-fields';
import { FormFieldType, formFields, requiredFormFields } from './form-fields';

type FormFieldValue = string | boolean;

interface FormInputs {
    [inputName: string]: FormFieldValue;
}

const ContactDetailsForm = () => {
    const [formInputs, setFormInputs] = useInputs<FormInputs>({});
    const { errors, setErrors, clearErrors } = useErrors();

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
        <>
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
        </>
    );
};

export default ContactDetailsForm;
