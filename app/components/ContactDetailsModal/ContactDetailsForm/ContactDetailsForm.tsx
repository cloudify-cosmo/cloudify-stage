import React from 'react';

const ContactDetailsForm = () => {
    return (
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
    );
};

export default ContactDetailsForm;
