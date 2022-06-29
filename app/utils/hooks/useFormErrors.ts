import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import type { ReduxState } from '../../reducers';
import { setFieldError, cleanFormErrors } from '../../actions/formErrors';
import type { FieldErrors } from '../../reducers/formErrorsReducer';

export default function useFormErrors(formName: string) {
    const fieldErrors: FieldErrors | undefined = useSelector((state: ReduxState) => state.formErrors?.[formName]);
    const dispatch = useDispatch();

    const getFieldError = useCallback(
        (fieldName: string) =>
            fieldErrors && fieldErrors[fieldName] ? { content: fieldErrors[fieldName], pointing: 'above' } : undefined,
        [formName, fieldErrors]
    );
    const setFieldErrorBound = (fieldName: string, message?: string) =>
        dispatch(setFieldError(formName, fieldName, message));
    const cleanFormErrorsBound = useCallback(() => dispatch(cleanFormErrors(formName)), [formName]);

    return {
        getFieldError,
        setFieldError: setFieldErrorBound,
        cleanFormErrors: cleanFormErrorsBound,
        fieldErrors
    };
}
