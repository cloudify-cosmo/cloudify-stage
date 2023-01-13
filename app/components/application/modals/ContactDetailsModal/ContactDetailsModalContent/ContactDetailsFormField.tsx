import React from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import styled from 'styled-components';
import { FormFieldType } from './formFields';
import type { FormField, FormValues } from './formFields';
import { Form } from '../../../../basic';
import CheckboxLabel from './CheckboxLabel';

const StyledFormField = styled(Form.Field)`
    flex: 1;
`;

interface ContactDetailsFormFieldProps {
    formField: FormField;
    formValues: FormValues;
    onChange: (event: ChangeEvent<HTMLInputElement> | FormEvent<HTMLInputElement>) => void;
}

const ContactDetailsFormField = ({ formField, formValues, onChange }: ContactDetailsFormFieldProps) => {
    return (
        <StyledFormField required={formField.isRequired}>
            {formField.type === FormFieldType.Text ? (
                <Form.Input
                    type="text"
                    name={formField.name}
                    label={formField.label}
                    value={formValues[formField.name]}
                    onChange={onChange}
                    required={formField.isRequired}
                />
            ) : (
                <Form.Checkbox
                    name={formField.name}
                    label={<CheckboxLabel label={formField.label} />}
                    help=""
                    checked={!!formValues[formField.name]}
                    onChange={onChange}
                />
            )}
        </StyledFormField>
    );
};

export default ContactDetailsFormField;
