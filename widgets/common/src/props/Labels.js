const LabelPropType = PropTypes.shape({ key: PropTypes.string, value: PropTypes.string, isInSystem: PropTypes.bool });

Stage.definePropType({
    name: 'Label',
    common: LabelPropType
});

Stage.definePropType({
    name: 'Labels',
    common: PropTypes.arrayOf(LabelPropType)
});
