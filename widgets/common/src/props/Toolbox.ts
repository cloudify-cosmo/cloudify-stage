const ToolboxPropType = PropTypes.shape({
    drillDown: PropTypes.func,
    getContext: PropTypes.func,
    getEventBus: PropTypes.func,
    getManager: PropTypes.func,
    getManagerState: PropTypes.func,
    getWidget: PropTypes.func,
    getWidgetBackend: PropTypes.func,
    goToPage: PropTypes.func,
    goToParentPage: PropTypes.func,
    loading: PropTypes.func,
    refresh: PropTypes.func
});

declare global {
    namespace Stage {
        interface PropTypes {
            Toolbox: typeof ToolboxPropType;
        }
    }
}

// NOTE: makes this file an ES module which prevent name collisions
export {};

Stage.definePropType({
    name: 'Toolbox',
    common: ToolboxPropType
});
