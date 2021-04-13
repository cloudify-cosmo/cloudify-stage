import CommonDropdown from './CommonDropdown';

export default function ValueDropdown({ labelKey, onChange, toolbox, multiple, allowKnownOnly, value }) {
    const { i18n } = Stage;

    return (
        <CommonDropdown
            disabled={!labelKey}
            baseFetchUrl={labelKey ? `/labels/deployments/${labelKey}` : ''}
            noResultsMessage={value && !allowKnownOnly ? i18n.t('widgets.common.labels.newValue') : undefined}
            placeholder={i18n.t(
                `widgets.common.labels.valuePlaceholder.${allowKnownOnly ? 'knownOnly' : 'knownOrNew'}`
            )}
            name="labelValue"
            tabIndex={labelKey ? 0 : -1}
            onChange={onChange}
            toolbox={toolbox}
            multiple={multiple}
            allowKnownOnly={allowKnownOnly}
            value={value}
        />
    );
}

ValueDropdown.propTypes = {
    labelKey: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    multiple: PropTypes.bool,
    allowKnownOnly: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
};

ValueDropdown.defaultProps = {
    labelKey: '',
    multiple: false,
    allowKnownOnly: false,
    value: null
};
