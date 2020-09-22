function useBoolean(initialValue = false) {
    const { useState } = React;

    const [value, setValue] = useState(initialValue);

    return [value, () => setValue(true), () => setValue(false)];
}

Stage.defineHook({
    useBoolean
});
