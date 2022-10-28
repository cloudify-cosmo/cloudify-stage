import type { Reducer } from 'redux';
import { ActionType } from '../actions/types';

export type FieldError = string | undefined;
export type FieldErrors = Record<string, FieldError>;
type FormErrors = Record<string, FieldErrors>;

/*
 * Example data structure:
 * {
 *     "formName": {
 *          "fieldName": "Error message"
 *     }
 * }
 */
const formErrorsReducer: Reducer<FormErrors | undefined> = (state = {}, action) => {
    switch (action.type) {
        case ActionType.SET_FIELD_ERROR: {
            const { [action.formName]: fieldErrors = {}, ...restState } = state;
            const { [action.fieldName]: fieldName, ...restFieldErrors } = fieldErrors;

            if (!action.message) {
                return { ...restState, [action.formName]: restFieldErrors };
            }

            return { ...restState, [action.formName]: { ...restFieldErrors, [action.fieldName]: action.message } };
        }
        case ActionType.CLEAN_FORM_ERRORS: {
            const { [action.formName]: _value, ...restState } = state;

            return restState;
        }
        default:
            return state;
    }
};

export default formErrorsReducer;
