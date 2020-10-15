import { useState } from 'react';

/**
 * Returns a stateful `errors` object and functions to manipulate it: `setErrors`, `clearErrors` and `setMessageAsError`,
 * which extracts message from given `Error` instance and sets it as actual error
 *
 * @returns {{clearErrors: (function(): void), setErrors: React.Dispatch<React.SetStateAction<{}>>, errors: {}, setMessageAsError: (function(*): void)}}
 */
export default function useErrors() {
    const [errors, setErrors] = useState({});

    return {
        errors,
        setMessageAsError: err => setErrors({ errors: err.message }),
        clearErrors: () => setErrors({}),
        setErrors
    };
}
