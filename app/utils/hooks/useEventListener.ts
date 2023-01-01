import { useEffect } from 'react';

export default function useEventListener(
    toolbox: Stage.Types.WidgetlessToolbox,
    event: string | undefined,
    handler: (...args: any[]) => void
) {
    useEffect(() => {
        if (event) {
            toolbox.getEventBus().on(event, handler);
            return () => toolbox.getEventBus().off(event, handler);
        }

        return undefined;
    }, [event, handler]);
}
