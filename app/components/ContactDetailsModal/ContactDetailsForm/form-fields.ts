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
        isRequired: true,
        type: FormFieldType.Text,
        validation: {
            errorMessage: 'Should be between 2 and 20 characters',
            regexp: ValidationRegexpPatterns.isBetweenCharactersRange(2, 20)
        }
    },
    {
        name: 'lastName',
        label: 'Last name',
        isRequired: true,
        type: FormFieldType.Text,
        validation: {
            errorMessage: 'Should be between 2 and 20 characters',
            regexp: ValidationRegexpPatterns.isBetweenCharactersRange(2, 20)
        }
    },
    {
        name: 'email',
        label: 'Email address',
        isRequired: true,
        type: FormFieldType.Text,
        validation: {
            errorMessage: 'Should be a valid email address',
            regexp: ValidationRegexpPatterns.isEmail
        }
    },
    {
        name: 'phone',
        label: 'Phone number',
        isRequired: true,
        type: FormFieldType.Text,
        validation: {
            errorMessage: 'Should be between 4 and 20 digits',
            regexp: ValidationRegexpPatterns.isBetweenDigitCharactersRange(4, 20)
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

export const requiredFormFields = formFields.filter(formField => formField.isRequired);
