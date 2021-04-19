/**
 * Defines a function that is triggered each time component is updated.
 * It is not triggered when the component mounts.
 *
 * @param onUpdate function to be triggered after each component's update
 * @param dependencies dependencies list passed to React.useEffect
 */
function useUpdateEffect(onUpdate: () => void, dependencies: React.DependencyList) {
    const { useEffect, useRef } = React;
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            onUpdate();
        }
    }, dependencies);
}

declare global {
    namespace Stage {
        interface Hooks {
            useUpdateEffect: typeof useUpdateEffect;
        }
    }
}
// NOTE: prevents leaking variables as global in TS
export {};

Stage.defineHook({ useUpdateEffect });
