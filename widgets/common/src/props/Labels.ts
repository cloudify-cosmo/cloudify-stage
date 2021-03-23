const LabelPropType = PropTypes.shape({ key: PropTypes.string, value: PropTypes.string, isInSystem: PropTypes.bool });
const LabelsPropType = PropTypes.arrayOf(LabelPropType);

declare namespace Stage {
    interface PropTypes {
        Label: typeof LabelPropType;
        Labels: typeof LabelsPropType;
    }
}

Stage.definePropType({
    name: 'Label',
    common: LabelPropType
});

Stage.definePropType({
    name: 'Labels',
    common: LabelsPropType
});
