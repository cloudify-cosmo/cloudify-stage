function useOpen(onOpen) {
    const { useEffect } = React;
    const { useBoolean } = Stage.Hooks;

    const [open, doOpen, doClose] = useBoolean();

    useEffect(() => {
        if (open) onOpen();
    }, [open]);

    return [open, doOpen, doClose];
}

Stage.defineHook({ useOpen });
