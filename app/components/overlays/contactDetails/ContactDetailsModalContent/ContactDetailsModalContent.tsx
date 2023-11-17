import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { useBoolean, useErrors, useInputs } from '../../../../utils/hooks';
import { Modal, Form, ApproveButton, ErrorMessage } from '../../../basic';
import type { FormField, FormValues } from './formFields';
import { FormFieldType, getFormFields } from './formFields';
import ContactDetailsFormField from './ContactDetailsFormField';
import StageUtils from '../../../../utils/stageUtils';
import { removeHtmlTagsFromString } from './utils';
import useManager from '../../../../utils/hooks/useManager';
import Internal from '../../../../utils/Internal';

const FieldsRow = styled.div`
    display: flex;
    gap: 16px;
`;

const translate = StageUtils.getT('contactDetailsModal.form');

interface ContactDetailsModalContentProps {
    closeModal: () => void;
}

const ContactDetailsModalContent: FunctionComponent<ContactDetailsModalContentProps> = ({ closeModal }) => {
    const [formValues, setFormValues] = useInputs<FormValues>({});
    const { errors, setErrors, clearErrors } = useErrors();
    const [hasSubmittingError, showSubmittingError, hideSubmittingError] = useBoolean();
    const [loading, setLoading, cancelLoading] = useBoolean();
    const manager = useManager();
    const internal = new Internal(manager);
    const formFields = useMemo(getFormFields, undefined);
    const requiredFormFields = useMemo(
        () => Object.values(formFields).filter(formField => formField.isRequired),
        undefined
    );

    const isFieldEmpty = (formField: FormField) => {
        const fieldValue = formValues[formField.name];
        if (formField.type === FormFieldType.Text) {
            return isEmpty(fieldValue);
        }

        return !fieldValue;
    };

    const isFieldValid = (formField: FormField) => {
        const fieldValue = formValues[formField.name] as string;
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
                validationErrors[formField.name] = `${formFieldLabel} - ${translate('validation.isFieldRequired')}`;
            } else if (!isFieldValid(formField)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                validationErrors[formField.name] = `${formFieldLabel} - ${formField.validation!.errorMessage}`;
            }
        });

        setErrors(validationErrors);

        return isEmpty(validationErrors);
    };

    const handleSubmit = () => {
        const fieldsAreValid = validateFields();
        hideSubmittingError();

        if (fieldsAreValid) {
            setLoading();
            internal
                .doPost('contactDetails/', {
                    body: formValues
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
                        header={translate('submittingError.title')}
                        error={translate('submittingError.description')}
                        onDismiss={hideSubmittingError}
                    />
                )}
                <Form errors={errors} onErrorsDismiss={clearErrors}>
                    <FieldsRow>
                        <ContactDetailsFormField
                            formField={formFields.firstName}
                            formValues={formValues}
                            onChange={setFormValues}
                        />
                        <ContactDetailsFormField
                            formField={formFields.lastName}
                            formValues={formValues}
                            onChange={setFormValues}
                        />
                    </FieldsRow>
                    <FieldsRow>
                        <ContactDetailsFormField
                            formField={formFields.email}
                            formValues={formValues}
                            onChange={setFormValues}
                        />
                        <ContactDetailsFormField
                            formField={formFields.phone}
                            formValues={formValues}
                            onChange={setFormValues}
                        />
                    </FieldsRow>
                    <ContactDetailsFormField
                        formField={formFields.isEula}
                        formValues={formValues}
                        onChange={setFormValues}
                    />
                    <ContactDetailsFormField
                        formField={formFields.isSendServiceDetails}
                        formValues={formValues}
                        onChange={setFormValues}
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <ApproveButton onClick={handleSubmit} loading={loading} disabled={loading}>
                    {translate('buttons.submit')}
                </ApproveButton>
            </Modal.Actions>
        </>
    );
};

export default ContactDetailsModalContent;
