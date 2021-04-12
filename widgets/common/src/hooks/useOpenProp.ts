/**
 * Defines function that is triggered each time the given value is set to `true`.
 * The most common use case for this hook is to trigger a function on each component opening, as defined by component prop.
 */

function useOpenProp(openProp: boolean, onOpen: () => void) {
    const { useEffect } = React;

    useEffect(() => {
        if (openProp) onOpen();
    }, [openProp]);
}

declare global {
    namespace Stage {
        interface Hooks {
            useOpenProp: typeof useOpenProp;
        }
    }
}
// NOTE: prevents leaking variables as global in TS
export {};

Stage.defineHook({ useOpenProp });
