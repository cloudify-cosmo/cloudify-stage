import { useCallback } from 'react';
import useEventListener from './useEventListener';

export default function useRefreshEvent(toolbox: Stage.Types.Toolbox, event: string) {
    const refresh = useCallback(toolbox.refresh, []);
    useEventListener(toolbox, event, refresh);
}
