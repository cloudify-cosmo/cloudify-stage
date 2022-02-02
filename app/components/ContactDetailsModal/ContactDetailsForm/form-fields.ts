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

const getFormFieldTranslationPath = (fieldName: string) => {
    return `fields.${fieldName}`;
};

export const getFormFieldValidationMessagePath = (fieldName: string) => {
    return `${getFormFieldTranslationPath(fieldName)}.validationMessage`;
};

export const getFormFieldLabelPath = (fieldName: string) => {
    return `${getFormFieldTranslationPath(fieldName)}.label`;
};

export const formFields: FormField[] = [
    {
        name: 'firstName',
        label: getFormFieldLabelPath('firstName'),
        type: FormFieldType.Text,
        validation: {
            errorMessage: getFormFieldValidationMessagePath('firstName'),
            regexp: ValidationRegexpPatterns.isBetweenCharactersRange(2, 20)
        },
        isRequired: true
    },
    {
        name: 'lastName',
        label: getFormFieldLabelPath('lastName'),
        type: FormFieldType.Text,
        validation: {
            errorMessage: getFormFieldValidationMessagePath('lastName'),
            regexp: ValidationRegexpPatterns.isBetweenCharactersRange(2, 20)
        },
        isRequired: true
    },
    {
        name: 'email',
        label: getFormFieldLabelPath('email'),
        type: FormFieldType.Text,
        validation: {
            errorMessage: getFormFieldValidationMessagePath('email'),
            regexp: ValidationRegexpPatterns.isEmail
        },
        isRequired: true
    },
    {
        name: 'phone',
        label: getFormFieldLabelPath('phone'),
        type: FormFieldType.Text,
        validation: {
            errorMessage: getFormFieldValidationMessagePath('phone'),
            regexp: ValidationRegexpPatterns.isBetweenDigitCharactersRange(4, 20)
        },
        isRequired: true
    },
    {
        name: 'isEULA',
        label: getFormFieldLabelPath('isEULA'),
        type: FormFieldType.Checkbox,
        isRequired: true
    },
    {
        name: 'isSendServicesDetails',
        label: getFormFieldLabelPath('isSendServicesDetails'),
        type: FormFieldType.Checkbox
    }
];

export const requiredFormFields = formFields.filter(formField => formField.isRequired);
