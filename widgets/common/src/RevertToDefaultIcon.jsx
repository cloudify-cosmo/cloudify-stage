function RevertToDefaultIcon({ value, defaultValue, onClick, style }) {
    const { Icon, Popup } = Stage.Basic;

    return !_.isUndefined(defaultValue) && !_.isEqual(value, defaultValue) ? (
        // TODO: Add language support
        <Popup trigger={<Icon name="undo" link onClick={onClick} style={style} />}>Revert to default value</Popup>
    ) : null;
}

RevertToDefaultIcon.propTypes = {
    /**
     * value typed field value
     */
    value: Stage.PropTypes.AnyData,

    /**
     * defaultValue typed field default value
     */
    defaultValue: Stage.PropTypes.AnyData,

    /**
     * onClick function to be called on revert icon click
     */
    onClick: PropTypes.func,

    /**
     * style styles to be added to revert icon
     */
    style: PropTypes.shape({})
};

RevertToDefaultIcon.defaultProps = {
    value: undefined, // value can be undefined
    defaultValue: undefined, // defaultValue can be undefined
    onClick: _.noop,
    style: {}
};

Stage.defineCommon({
    name: 'RevertToDefaultIcon',
    common: RevertToDefaultIcon
});
