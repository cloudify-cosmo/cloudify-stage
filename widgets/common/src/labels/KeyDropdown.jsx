import CommonDropdown from './CommonDropdown';

export default function KeyDropdown({ innerRef, onChange, toolbox, allowAdditions, value }) {
    const { i18n } = Stage;

    return (
        <CommonDropdown
            innerRef={innerRef}
            fetchUrl="/labels/deployments"
            noResultsMessage={value && !allowAdditions ? i18n.t('widgets.common.labels.newKey') : undefined}
            placeholder={i18n.t('widgets.common.labels.keyPlaceholder')}
            name="labelKey"
            tabIndex={0}
            onChange={onChange}
            toolbox={toolbox}
            additionLabel={`${i18n.t('widgets.common.labels.newKey')} `}
            allowAdditions={allowAdditions}
            value={value}
        />
    );
}

KeyDropdown.propTypes = {
    innerRef: PropTypes.shape({ current: PropTypes.instanceOf(HTMLElement) }).isRequired,
    onChange: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    allowAdditions: PropTypes.bool,
    value: PropTypes.string
};

KeyDropdown.defaultProps = {
    allowAdditions: false,
    value: null
};
