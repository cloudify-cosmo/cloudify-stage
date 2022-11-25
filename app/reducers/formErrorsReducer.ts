import type { Reducer } from 'redux';
import { ActionType } from '../actions/types';
import type { FormErrorsAction } from '../actions/formErrors';

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
const formErrorsReducer: Reducer<FormErrors | undefined, FormErrorsAction> = (state = {}, action) => {
    switch (action.type) {
        case ActionType.SET_FIELD_ERROR: {
            const { [action.payload.formName]: fieldErrors = {}, ...restState } = state;
            const { [action.payload.fieldName]: fieldName, ...restFieldErrors } = fieldErrors;

            if (!action.payload.message) {
                return { ...restState, [action.payload.formName]: restFieldErrors };
            }

            return {
                ...restState,
                [action.payload.formName]: { ...restFieldErrors, [action.payload.fieldName]: action.payload.message }
            };
        }
        case ActionType.CLEAN_FORM_ERRORS: {
            const { [action.payload]: _value, ...restState } = state;

            return restState;
        }
        default:
            return state;
    }
};

export default formErrorsReducer;
