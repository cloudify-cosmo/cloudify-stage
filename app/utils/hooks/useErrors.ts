import { useState } from 'react';
import type { StrictLabelProps } from 'semantic-ui-react';

/**
 * Returns a stateful `errors` object and functions to manipulate it: `setErrors`, `clearErrors` and helper functions:
 * `setMessageAsError`, which extracts message from given `Error` instance and sets it as actual error,
 * `getContextError`, which for a given field name provides a value to be passed to `error` prop in `Form.Field`
 * component
 */
export default function useErrors() {
    const [errors, setErrors] = useState({} as Record<string, any>);

    return {
        errors,
        getContextError: (field: string, pointing: StrictLabelProps['pointing'] = 'above') =>
            errors[field] ? { content: errors[field], pointing } : undefined,
        setMessageAsError: (err: { message: string }) => setErrors({ errors: err.message }),
        clearErrors: () => setErrors({}),
        setErrors
    };
}
