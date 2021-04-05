/**
 * Returns a stateful map of values and functions to manipulate it:
 * `setInputs` which merges the given map into the values map and can be directly used as SUIR `onChange` handler,
 * `clearValue` which resets the values map back to its initial state
 */
function useInputs<T extends Record<string, any>>(initialValues: T) {
    const { useState } = React;

    const [inputs, setInputs] = useState(initialValues);

    return [
        inputs,
        (values: any, field?: any) =>
            setInputs({ ...inputs, ...(field ? Stage.Basic.Form.fieldNameValue(field) : values) }),
        () => setInputs(initialValues)
    ] as const;
}

export default useInputs;
