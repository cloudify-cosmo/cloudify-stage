import CommonDropdown from './CommonDropdown';

export default function KeyDropdown({ innerRef, onChange, toolbox, value }) {
    const { i18n } = Stage;

    return (
        <CommonDropdown
            innerRef={innerRef}
            baseFetchUrl="/labels/deployments"
            noResultsMessage={value ? i18n.t('widgets.common.labels.newKey') : undefined}
            placeholder={i18n.t('widgets.common.labels.keyPlaceholder')}
            name="labelKey"
            tabIndex={0}
            onChange={onChange}
            toolbox={toolbox}
            value={value}
        />
    );
}

KeyDropdown.propTypes = {
    innerRef: PropTypes.shape({ current: PropTypes.instanceOf(HTMLElement) }).isRequired,
    onChange: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    value: PropTypes.string
};

KeyDropdown.defaultProps = {
    value: null
};
