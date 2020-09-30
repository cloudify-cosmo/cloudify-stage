/**
 * Returns a stateful map of values and functions to manipulate it:
 * `setInputs` which merges the given map into the values map and can be directly used as SUIR `onChange` handler,
 * `clearValue` which resets the values map back to its initial state
 *
 * @param initialValues
 * @returns {(any|(function(*, *=): void)|(function(): void))[]}
 */
function useInputs(initialValues) {
    const { useState } = React;

    const [inputs, setInputs] = useState(initialValues);

    return [
        inputs,
        (values, field) => setInputs({ ...inputs, ...(field ? Stage.Basic.Form.fieldNameValue(field) : values) }),
        () => setInputs(initialValues)
    ];
}

Stage.defineHook({ useInputs });
