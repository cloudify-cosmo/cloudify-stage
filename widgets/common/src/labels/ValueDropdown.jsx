import CommonDropdown from './CommonDropdown';

export default function ValueDropdown({ labelKey, onChange, toolbox, multiple, allowAdditions, value }) {
    const { i18n } = Stage;

    return (
        <CommonDropdown
            disabled={!labelKey}
            fetchUrl={labelKey ? `/labels/deployments/${labelKey}` : ''}
            noResultsMessage={value && !allowAdditions ? i18n.t('widgets.common.labels.newValue') : undefined}
            placeholder={i18n.t('widgets.common.labels.valuePlaceholder')}
            name="labelValue"
            tabIndex={labelKey ? 0 : -1}
            onChange={onChange}
            toolbox={toolbox}
            multiple={multiple}
            additionLabel={`${i18n.t('widgets.common.labels.newValue')} `}
            allowAdditions={allowAdditions}
            value={value}
        />
    );
}

ValueDropdown.propTypes = {
    labelKey: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    multiple: PropTypes.bool,
    allowAdditions: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
};

ValueDropdown.defaultProps = {
    labelKey: '',
    multiple: false,
    allowAdditions: false,
    value: null
};
