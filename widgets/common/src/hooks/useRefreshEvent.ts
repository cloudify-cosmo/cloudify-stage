function useRefreshEvent(toolbox: Stage.Types.Toolbox, event: string) {
    const { useEventListener } = Stage.Hooks;
    useEventListener(toolbox, event, toolbox.refresh);
}

declare global {
    namespace Stage {
        interface Hooks {
            useRefreshEvent: typeof useRefreshEvent;
        }
    }
}

export {};

Stage.defineHook({ useRefreshEvent });
