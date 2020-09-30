/**
 * Returns a value that represents a component's open/closed state. Additionally returns `doOpen` and `doClose` functions that can be used to toggle the state.
 *
 * @param onOpen function to be triggered after each component's opening
 * @returns {*[]}
 */
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
