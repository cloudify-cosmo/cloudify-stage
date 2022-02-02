import ValidationRegexpPatterns from './validation-regexp-patterns';

export enum FormFieldType {
    Text,
    Checkbox
}

interface FormFieldValidation {
    regexp: RegExp;
    errorMessage: string;
}

export interface FormField {
    name: string;
    label: string;
    isRequired?: boolean;
    type: FormFieldType;
    validation?: FormFieldValidation;
}

export const formFields: FormField[] = [
    {
        name: 'firstName',
        label: 'First name',
        type: FormFieldType.Text,
        validation: {
            errorMessage: 'Please provide a valid first name, which should be between 2 to 20 characters long',
            regexp: ValidationRegexpPatterns.isBetweenCharactersRange(2, 20)
        },
        isRequired: true
    },
    {
        name: 'lastName',
        label: 'Last name',
        type: FormFieldType.Text,
        validation: {
            errorMessage: 'Please provide a valid last name, which should be between 2 and 20 characters long',
            regexp: ValidationRegexpPatterns.isBetweenCharactersRange(2, 20)
        },
        isRequired: true
    },
    {
        name: 'email',
        label: 'Email address',
        type: FormFieldType.Text,
        validation: {
            errorMessage: 'Please provide a valid email address',
            regexp: ValidationRegexpPatterns.isEmail
        },
        isRequired: true
    },
    {
        name: 'phone',
        label: 'Phone number',
        type: FormFieldType.Text,
        validation: {
            errorMessage: 'Please provide a valid phone number, which should be between 4 and 20 digits long',
            regexp: ValidationRegexpPatterns.isBetweenDigitCharactersRange(4, 20)
        },
        isRequired: true
    },
    {
        name: 'isEULA',
        label:
            'By registering for the Cloudify Hosted Service you agree to the <a href="https://cloudify.co/license" target="_blank">Hosted Trial End User License Agreement</a>',
        type: FormFieldType.Checkbox,
        isRequired: true
    },
    {
        name: 'isSendServicesDetails',
        label:
            'Cloudify uses the information provided to send you your service details. For more information see our <a href="https://cloudify.co/privacy-policy/" target="_blank">Privacy Policy</a>',
        type: FormFieldType.Checkbox
    }
];

export const requiredFormFields = formFields.filter(formField => formField.isRequired);
