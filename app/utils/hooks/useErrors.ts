import { useState } from 'react';

/**
 * Returns a stateful `errors` object and functions to manipulate it: `setErrors`, `clearErrors` and `setMessageAsError`,
 * which extracts message from given `Error` instance and sets it as actual error
 */
export default function useErrors() {
    const [errors, setErrors] = useState({} as Record<string, any>);

    return {
        errors,
        setMessageAsError: (err: Error) => setErrors({ errors: err.message }),
        clearErrors: () => setErrors({}),
        setErrors
    };
}
