import * as types from './types';

export function setFieldError(formName: string, fieldName: string, message?: string) {
    return {
        type: types.SET_FIELD_ERROR,
        formName,
        fieldName,
        message
    };
}

export function cleanFormErrors(formName: string) {
    return {
        type: types.CLEAN_FORM_ERRORS,
        formName
    };
}
