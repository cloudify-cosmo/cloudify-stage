import { useState } from 'react';
import type { StrictLabelProps } from 'semantic-ui-react';
import { isEmpty } from 'lodash';

/**
 * Returns a stateful `errors` object and functions to manipulate it: `setErrors`, `clearErrors` and helper functions:
 * `setMessageAsError`, which extracts message from given `Error` instance and sets it as actual error,
 * `getContextError`, which for a given field name provides a value to be passed to `error` prop in `Form.Field` component,
 * `createEmptyErrors`, which creates a typed empty errors object
 */
export default function useErrors<FieldName extends string = string>() {
    type FieldErrors = Partial<Record<FieldName, any>>;
    const [errors, setErrors] = useState<{ errors: string } | FieldErrors>({});

    return {
        errors: errors as FieldErrors,
        getContextError: (field: FieldName, pointing: StrictLabelProps['pointing'] = 'above') =>
            field in errors ? { content: (<FieldErrors>errors)[field], pointing } : undefined,
        setMessageAsError: (err: { message: string }) => setErrors({ errors: err.message }),
        clearErrors: () => setErrors({}),
        setErrors,
        performValidations: (executeValidations: (validationErrors: FieldErrors) => void, onSuccess: () => void) => {
            const validationErrors: FieldErrors = {};
            executeValidations(validationErrors);
            setErrors(validationErrors);
            if (isEmpty(validationErrors)) onSuccess();
        }
    };
}
