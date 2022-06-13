import React from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { FormFieldType } from './formFields';
import type { FormField, FormValues } from './formFields';
import { Form } from '../../basic';
import CheckboxLabel from './CheckboxLabel';

interface ContactDetailsFormFieldProps {
    formField: FormField;
    formValues: FormValues;
    onChange: (event: ChangeEvent<HTMLInputElement> | FormEvent<HTMLInputElement>) => void;
}

const ContactDetailsFormField = ({ formField, formValues, onChange }: ContactDetailsFormFieldProps) => {
    return (
        <Form.Field key={formField.name} required={formField.isRequired}>
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
        </Form.Field>
    );
};

export default ContactDetailsFormField;
