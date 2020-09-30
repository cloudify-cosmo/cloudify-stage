/**
 * Returns a stateful `errors` object and functions to manipulate it: `setErrors`, `clearErrors` and `setMessageAsError`,
 * which extracts message from given `Error` instance and sets it as actual error
 *
 * @returns {{clearErrors: (function(): void), setErrors: React.Dispatch<React.SetStateAction<{}>>, errors: {}, setMessageAsError: (function(*): void)}}
 */
function useErrors() {
    const { useState } = React;

    const [errors, setErrors] = useState({});

    return {
        errors,
        setMessageAsError: err => setErrors({ errors: err.message }),
        clearErrors: () => setErrors({}),
        setErrors
    };
}

Stage.defineHook({
    useErrors
});
