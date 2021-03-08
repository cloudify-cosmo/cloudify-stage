/**
 * Returns a stateful value and functions to manipulate it:
 * `setInput` which sets the value and can be directly used as SUIR `onChange` handler,
 * `clearValue` which sets the value back to the initial one
 */
function useInput<T>(initialValue: T) {
    const { useResettableState } = Stage.Hooks;

    const [input, setInput, clearInput] = useResettableState(initialValue);

    return [input, (value: any, field?: any) => setInput(field ? field.value : value), clearInput] as const;
}

declare namespace Stage {
    interface Hooks {
        useInput: typeof useInput;
    }
}
Stage.defineHook({ useInput });
