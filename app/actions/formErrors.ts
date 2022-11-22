import type { PayloadAction } from './types';
import { ActionType } from './types';

export type SetFieldErrorAction = PayloadAction<
    { formName: string; fieldName: string; message?: string },
    ActionType.SET_FIELD_ERROR
>;
export type CleanFormErrorsAction = PayloadAction<string, ActionType.CLEAN_FORM_ERRORS>;

export type FormErrorsAction = SetFieldErrorAction | CleanFormErrorsAction;

export function setFieldError(formName: string, fieldName: string, message?: string): SetFieldErrorAction {
    return {
        type: ActionType.SET_FIELD_ERROR,
        payload: {
            formName,
            fieldName,
            message
        }
    };
}

export function cleanFormErrors(formName: string): CleanFormErrorsAction {
    return {
        type: ActionType.CLEAN_FORM_ERRORS,
        payload: formName
    };
}
