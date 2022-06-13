import * as ValidationRegexpPatterns from './validationRegexpPatterns';
import StageUtils from '../../../utils/stageUtils';

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

const { getT, composeT } = StageUtils;

const t = getT('contactDetailsModal.form.fields');

const getFormFieldValidationMessage = (fieldName: string) => {
    return composeT(t, fieldName)('validationMessage');
};

const getFormFieldLabel = (fieldName: string, params?: Record<string, any>) => {
    return composeT(t, fieldName)('label', params);
};

export const getFormFields = (): Record<string, FormField> => ({
    firstName: {
        name: 'first_name',
        label: getFormFieldLabel('firstName'),
        type: FormFieldType.Text,
        validation: {
            errorMessage: getFormFieldValidationMessage('firstName'),
            regexp: ValidationRegexpPatterns.isBetweenCharactersRange(2, 20)
        },
        isRequired: true
    },
    lastName: {
        name: 'last_name',
        label: getFormFieldLabel('lastName'),
        type: FormFieldType.Text,
        validation: {
            errorMessage: getFormFieldValidationMessage('lastName'),
            regexp: ValidationRegexpPatterns.isBetweenCharactersRange(2, 20)
        },
        isRequired: true
    },
    email: {
        name: 'email',
        label: getFormFieldLabel('email'),
        type: FormFieldType.Text,
        validation: {
            errorMessage: getFormFieldValidationMessage('email'),
            regexp: ValidationRegexpPatterns.emailRegexp
        },
        isRequired: true
    },
    phone: {
        name: 'phone',
        label: getFormFieldLabel('phone'),
        type: FormFieldType.Text,
        validation: {
            errorMessage: getFormFieldValidationMessage('phone'),
            regexp: ValidationRegexpPatterns.isBetweenDigitCharactersRange(4, 20)
        }
    },
    isEula: {
        name: 'is_eula',
        label: getFormFieldLabel('isEULA', { eulaLink: getT('licenseManagement')('eulaLinkCommunity') }),
        type: FormFieldType.Checkbox,
        isRequired: true
    },
    isSendServiceDetails: {
        name: 'is_send_services_details',
        label: getFormFieldLabel('isSendServicesDetails'),
        type: FormFieldType.Checkbox
    }
});
