// @ts-nocheck File not migrated fully to TS
export {};

const { i18n } = Stage;

function RevertToDefaultIcon({ value, defaultValue, onClick, onMouseDown, popupContent, style }) {
    const { Icon, Popup } = Stage.Basic;

    if (defaultValue === undefined || _.isEqual(value, defaultValue)) {
        return null;
    }

    return (
        <Popup
            trigger={
                <Icon
                    aria-label="Revert value to default"
                    name="undo"
                    link
                    onClick={onClick}
                    onMouseDown={onMouseDown}
                    style={style}
                />
            }
        >
            {popupContent}
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
     * function to be called on revert icon mouse down
     */
    onMouseDown: PropTypes.func,

    /**
     * popup content to be shown on mouse over
     */
    popupContent: PropTypes.node,

    /**
     * styles to be added to revert icon
     */
    style: PropTypes.shape({})
};

RevertToDefaultIcon.defaultProps = {
    value: undefined, // value can be undefined
    defaultValue: undefined, // defaultValue can be undefined
    onClick: undefined,
    onMouseDown: undefined,
    popupContent: i18n.t('widgets.common.revertToDefault'),
    style: {}
};

export default RevertToDefaultIcon;
