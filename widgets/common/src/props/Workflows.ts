const WorkflowsPropType = PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired, plugin: PropTypes.string.isRequired })
);

declare global {
    namespace Stage {
        interface PropTypes {
            Workflows: typeof WorkflowsPropType;
        }
    }
}

// NOTE: makes this file an ES module which prevent name collisions
export {};

Stage.definePropType({
    name: 'Workflows',
    common: WorkflowsPropType
});
