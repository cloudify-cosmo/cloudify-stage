/**
 * Returns a stateful value and functions to manipulate it:
 * `setInput` which sets the value and can be directly used as SUIR `onChange` handler,
 * `clearValue` which sets the value back to the initial one
 *
 * @param initialValue
 * @returns {(*|(function(*, *): *))[]}
 */
function useInput(initialValue) {
    const { useResettableState } = Stage.Hooks;

    const [input, setInput, clearInput] = useResettableState(initialValue);

    return [input, (value, field) => setInput(field ? field.value : value), clearInput];
}

Stage.defineHook({ useInput });
