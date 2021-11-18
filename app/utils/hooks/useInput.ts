import useResettableState from './useResettableState';

/**
 * Returns a stateful value and functions to manipulate it:
 * `setInput` which sets the value and can be directly used as SUIR `onChange` handler,
 * `clearValue` which sets the value back to the initial one
 */
function useInput<T>(initialValue: T) {
    const [input, setInput, clearInput] = useResettableState(initialValue);

    return [
        input,
        (
            value: any,
            field?: { value?: boolean | number | string | (boolean | number | string)[]; checked?: boolean }
        ) => setInput(field ? field.value ?? field.checked : value),
        clearInput
    ] as const;
}

export default useInput;
