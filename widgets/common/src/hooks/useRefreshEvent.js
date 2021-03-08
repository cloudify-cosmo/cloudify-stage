function useRefreshEvent(toolbox, event) {
    const { useEventListener } = Stage.Hooks;
    useEventListener(toolbox, event, toolbox.refresh);
}

Stage.defineHook({ useRefreshEvent });
