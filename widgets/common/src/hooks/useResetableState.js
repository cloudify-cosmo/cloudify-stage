function useResetableState(initialValue) {
    const { useState } = React;

    const [value, setValue] = useState(initialValue);

    return [value, setValue, () => setValue(initialValue)];
}

Stage.defineHook({ useResetableState });
