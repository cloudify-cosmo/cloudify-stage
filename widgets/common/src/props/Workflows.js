Stage.definePropType({
    name: 'Workflows',
    common: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, plugin: PropTypes.string }))
});
