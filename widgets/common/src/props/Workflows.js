Stage.definePropType({
    name: 'Workflows',
    common: PropTypes.arrayOf(
        PropTypes.shape({ name: PropTypes.string.isRequired, plugin: PropTypes.string.isRequired })
    )
});
