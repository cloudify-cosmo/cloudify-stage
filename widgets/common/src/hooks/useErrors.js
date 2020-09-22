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
