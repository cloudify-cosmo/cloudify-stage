/**
 * Defines function that is triggered each time the given value is set to `true`.
 * The most common use case for this hook is to trigger a function on each component opening, as defined by component prop.
 *
 * @param openProp given value, most commonly component's `open` prop
 * @param onOpen function to be triggered
 */

function useOpenProp(openProp, onOpen) {
    const { useEffect } = React;

    useEffect(() => {
        if (openProp) onOpen();
    }, [openProp]);
}

Stage.defineHook({ useOpenProp });
