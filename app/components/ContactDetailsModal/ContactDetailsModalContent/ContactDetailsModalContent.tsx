import React, { FunctionComponent } from 'react';
import { useBoolean, useErrors, useInputs } from '../../../utils/hooks';
import { Modal, Form, ApproveButton } from '../../basic';
import type { FormField } from './formFields';
import { FormFieldType, formFields, requiredFormFields } from './formFields';
import CheckboxLabel from './CheckboxLabel';
import StageUtils from '../../../utils/stageUtils';
import { removeHtmlTagsFromString } from './utils';
import useManager from '../../../utils/hooks/useManager';
import Internal from '../../../utils/Internal';

const t = StageUtils.getT('contactDetailsModal.form');

type FormFieldValue = string | boolean;

interface FormInputs {
    [inputName: string]: FormFieldValue;
}

interface ContactDetailsModalContentProps {
    closeModal: () => void;
}

const ContactDetailsModalContent: FunctionComponent<ContactDetailsModalContentProps> = ({ closeModal }) => {
    const [formInputs, setFormInputs] = useInputs<FormInputs>({});
    const { errors, setErrors, clearErrors } = useErrors();
    const [loading, setLoading] = useBoolean();
    const manager = useManager();
    const internal = new Internal(manager);

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

    const validateFields = (): boolean => {
        const validationErrors: Record<string, unknown> = {};

        requiredFormFields.forEach(formField => {
            const formFieldLabel = removeHtmlTagsFromString(t(formField.label));

            if (formField.isRequired && isFieldEmpty(formField)) {
                validationErrors[formField.name] = `${formFieldLabel} - ${t('validation.isFieldRequired')}`;
            } else if (!isFieldValid(formField)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                validationErrors[formField.name] = `${formFieldLabel} - ${t(formField.validation!.errorMessage)}`;
            }
        });

        setErrors(validationErrors);

        return _.isEmpty(validationErrors);
    };

    const handleSubmit = () => {
        const fieldsAreValid = validateFields();

        if (fieldsAreValid) {
            setLoading();
            internal
                .doPost('contactDetails/', {
                    body: formInputs
                })
                .then(() => closeModal());
        }
    };

    return (
        <>
            <Modal.Content>
                <Form errors={errors} onErrorsDismiss={clearErrors}>
                    {formFields.map(formField => (
                        <Form.Field key={formField.name} required={formField.isRequired}>
                            {formField.type === FormFieldType.Text ? (
                                <Form.Input
                                    type="text"
                                    name={formField.name}
                                    label={t(formField.label)}
                                    value={formInputs[formField.name]}
                                    onChange={setFormInputs}
                                    required={formField.isRequired}
                                />
                            ) : (
                                <Form.Checkbox
                                    name={formField.name}
                                    label={<CheckboxLabel label={formField.label} />}
                                    help=""
                                    checked={formInputs[formField.name]}
                                    onChange={setFormInputs}
                                />
                            )}
                        </Form.Field>
                    ))}
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <ApproveButton color="green" onClick={handleSubmit} loading={loading} disabled={loading}>
                    {t('buttons.submit')}
                </ApproveButton>
            </Modal.Actions>
        </>
    );
};

export default ContactDetailsModalContent;
