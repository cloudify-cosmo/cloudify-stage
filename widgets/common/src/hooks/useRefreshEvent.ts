import { useCallback } from 'react';

function useRefreshEvent(toolbox: Stage.Types.Toolbox, event: string) {
    const { useEventListener } = Stage.Hooks;
    const refresh = useCallback(toolbox.refresh, []);
    useEventListener(toolbox, event, refresh);
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
