import CommonDropdown from './CommonDropdown';

export default function KeyDropdown({ innerRef, onChange, toolbox, allowKnownOnly, value }) {
    const { i18n } = Stage;

    return (
        <CommonDropdown
            innerRef={innerRef}
            fetchUrl="/labels/deployments"
            noResultsMessage={value && !allowKnownOnly ? i18n.t('widgets.common.labels.newKey') : undefined}
            placeholder={i18n.t(`widgets.common.labels.keyPlaceholder.${allowKnownOnly ? 'knownOnly' : 'knownOrNew'}`)}
            name="labelKey"
            tabIndex={0}
            onChange={onChange}
            toolbox={toolbox}
            allowKnownOnly={allowKnownOnly}
            value={value}
        />
    );
}

KeyDropdown.propTypes = {
    innerRef: PropTypes.shape({ current: PropTypes.instanceOf(HTMLElement) }).isRequired,
    onChange: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    allowKnownOnly: PropTypes.bool,
    value: PropTypes.string
};

KeyDropdown.defaultProps = {
    allowKnownOnly: false,
    value: null
};
