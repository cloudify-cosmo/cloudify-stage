function useInput(initialValue) {
    const { useResetableState } = Stage.Hooks;

    const [input, setInput, clearInput] = useResetableState(initialValue);

    return [input, (value, field) => setInput(field ? field.value : value), clearInput];
}

Stage.defineHook({ useInput });
