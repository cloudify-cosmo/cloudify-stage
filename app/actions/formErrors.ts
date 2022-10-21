import { ActionType } from './types';

export function setFieldError(formName: string, fieldName: string, message?: string) {
    return {
        type: ActionType.SET_FIELD_ERROR,
        formName,
        fieldName,
        message
    };
}

export function cleanFormErrors(formName: string) {
    return {
        type: ActionType.CLEAN_FORM_ERRORS,
        formName
    };
}
