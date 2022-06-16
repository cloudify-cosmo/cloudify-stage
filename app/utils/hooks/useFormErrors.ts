import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from '../../reducers';
import { setFieldError, cleanFormErrors } from '../../actions/formErrors';
import { useCallback } from 'react';
export default function useFormErrors(formName: string) {
    const fieldErrors = useSelector((state: ReduxState) => state.formErrors?.[formName]);
    const dispatch = useDispatch();

    const getFieldError = useCallback((fieldName: string) => (
        fieldErrors?.[fieldName] ? {content: fieldErrors[fieldName]} : undefined
        ), [ formName]);
    const setFieldErrorBound = (fieldName: string, message?: string) => dispatch(setFieldError(formName, fieldName, message));
    const cleanFormErrorsBound = useCallback(() => dispatch(cleanFormErrors(formName)), [formName]);

    return [
        getFieldError,
        setFieldErrorBound,
        cleanFormErrorsBound,
        fieldErrors
    ];
}
