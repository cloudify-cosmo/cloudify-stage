import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { useBoolean, useErrors, useInputs } from '../../../utils/hooks';
import { Modal, Form, ApproveButton, ErrorMessage } from '../../basic';
import type { FormField } from './formFields';
import { FormFieldType, getFormFields } from './formFields';
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
    const [hasSubmittingError, showSubmittingError, hideSubmittingError] = useBoolean();
    const [loading, setLoading, cancelLoading] = useBoolean();
    const manager = useManager();
    const internal = new Internal(manager);
    const formFields = useMemo(() => getFormFields(), undefined);
    const requiredFormFields = useMemo(
        () => Object.values(formFields).filter(formField => formField.isRequired),
        undefined
    );

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
            const formFieldLabel = removeHtmlTagsFromString(formField.label);

            if (formField.isRequired && isFieldEmpty(formField)) {
                validationErrors[formField.name] = `${formFieldLabel} - ${t('validation.isFieldRequired')}`;
            } else if (!isFieldValid(formField)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                validationErrors[formField.name] = `${formFieldLabel} - ${formField.validation!.errorMessage}`;
            }
        });

        setErrors(validationErrors);

        return _.isEmpty(validationErrors);
    };

    const handleSubmit = () => {
        const fieldsAreValid = validateFields();
        hideSubmittingError();

        if (fieldsAreValid) {
            setLoading();
            internal
                .doPost('contactDetails/', {
                    body: formInputs
                })
                .then(() => closeModal())
                .catch(() => {
                    showSubmittingError();
                    cancelLoading();
                });
        }
    };

    return (
        <>
            <Modal.Content>
                {hasSubmittingError && (
                    <ErrorMessage
                        header={t('submittingError.title')}
                        error={t('submittingError.description')}
                        onDismiss={hideSubmittingError}
                    />
                )}
                <Form errors={errors} onErrorsDismiss={clearErrors}>
                    {Object.values(formFields).map(formField => (
                        <Form.Field key={formField.name} required={formField.isRequired}>
                            {/* TODO: Extract logic a separate component */}
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
                                    label={<CheckboxLabel label={formField.label} />}
                                    help=""
                                    checked={!!formInputs[formField.name]}
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
