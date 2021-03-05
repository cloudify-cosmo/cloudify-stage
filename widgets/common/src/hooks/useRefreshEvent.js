import { useEffect } from 'react';

function useRefreshEvent(toolbox, event, handler = toolbox.refresh) {
    useEffect(() => {
        if (event) {
            toolbox.getEventBus().on(event, handler);
            return () => toolbox.getEventBus().off(event, handler);
        }

        return undefined;
    }, [event, handler]);
}

Stage.defineHook({ useRefreshEvent });
