import { useEffect } from 'react';

function useEventListener(toolbox, event, handler) {
    useEffect(() => {
        if (event) {
            toolbox.getEventBus().on(event, handler);
            return () => toolbox.getEventBus().off(event, handler);
        }

        return undefined;
    }, [event, handler]);
}

Stage.defineHook({ useEventListener });
