import CommonDropdown from './CommonDropdown';

export default function ValueDropdown({ labelKey, onChange, toolbox, value }) {
    const { i18n } = Stage;

    return (
        <CommonDropdown
            disabled={!labelKey}
            baseFetchUrl={labelKey ? `/labels/deployments/${labelKey}` : ''}
            noResultsMessage={value ? i18n.t('widgets.common.labels.newValue') : undefined}
            placeholder={i18n.t('widgets.common.labels.valuePlaceholder')}
            name="labelValue"
            tabIndex={labelKey ? 0 : -1}
            onChange={onChange}
            toolbox={toolbox}
            value={value}
        />
    );
}

ValueDropdown.propTypes = {
    labelKey: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    value: PropTypes.string
};

ValueDropdown.defaultProps = {
    labelKey: '',
    value: null
};
