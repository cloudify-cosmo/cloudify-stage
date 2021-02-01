function RevertToDefaultIcon({ value, defaultValue, onClick, style }) {
    const { i18n } = Stage;
    const { Icon, Popup } = Stage.Basic;

    if (defaultValue === undefined || _.isEqual(value, defaultValue)) {
        return null;
    }

    return (
        <Popup trigger={<Icon name="undo" link onClick={onClick} style={style} />}>
            {i18n.t('widgets.common.revertToDefault')}
        </Popup>
    );
}

RevertToDefaultIcon.propTypes = {
    /**
     * field value
     */
    value: Stage.PropTypes.AnyData,

    /**
     * field default value
     */
    defaultValue: Stage.PropTypes.AnyData,

    /**
     * function to be called on revert icon click
     */
    onClick: PropTypes.func,

    /**
     * styles to be added to revert icon
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
