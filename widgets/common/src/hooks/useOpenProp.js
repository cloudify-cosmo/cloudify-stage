function useOpenProp(openProp, onOpen) {
    const { useEffect } = React;

    useEffect(() => {
        if (openProp) onOpen();
    }, [openProp]);
}

Stage.defineHook({ useOpenProp });
