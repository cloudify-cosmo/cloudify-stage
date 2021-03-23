/**
 * Returns a value that represents a component's open/closed state. Additionally returns `doOpen` and `doClose` functions that can be used to toggle the state.
 */
function useOpen(onOpen: () => void) {
    const { useEffect } = React;
    const { useBoolean } = Stage.Hooks;

    const [open, doOpen, doClose] = useBoolean();

    useEffect(() => {
        if (open) onOpen();
    }, [open]);

    return [open, doOpen, doClose] as const;
}

declare namespace Stage {
    interface Hooks {
        useOpen: typeof useOpen;
    }
}

Stage.defineHook({ useOpen });
