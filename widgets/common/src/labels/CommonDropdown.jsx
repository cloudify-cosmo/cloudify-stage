import ValidationErrorPopup from './ValidationErrorPopup';

export default function CommonDropdown({ innerRef, fetchUrl, onChange, toolbox, allowKnownOnly, value, ...rest }) {
    const { useEffect } = React;
    const {
        Common: { DynamicDropdown },
        Hooks: { useLabelInput }
    } = Stage;

    const {
        inputValue,
        invalidCharacterTyped,
        submitChange,
        resetInput,
        unsetInvalidCharacterTyped
    } = useLabelInput(onChange, { allowKnownOnly });

    useEffect(() => {
        if (_.isEmpty(value)) {
            resetInput();
        }
    }, [value]);

    return (
        <>
            {invalidCharacterTyped && <ValidationErrorPopup />}

            <DynamicDropdown
                innerRef={innerRef}
                clearable={false}
                fetchUrl={fetchUrl}
                itemsFormatter={items => _.map(items, item => ({ id: item }))}
                onBlur={unsetInvalidCharacterTyped}
                onChange={newValue => submitChange(null, { value: newValue })}
                onSearchChange={allowKnownOnly ? undefined : submitChange}
                searchQuery={allowKnownOnly ? undefined : inputValue}
                selectOnNavigation={allowKnownOnly}
                toolbox={toolbox}
                value={allowKnownOnly ? value : undefined}
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...rest}
            />
        </>
    );
}

CommonDropdown.propTypes = {
    fetchUrl: PropTypes.string.isRequired,
    innerRef: PropTypes.shape({ current: PropTypes.instanceOf(HTMLElement) }),
    onChange: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    allowKnownOnly: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
};

CommonDropdown.defaultProps = {
    innerRef: null,
    allowKnownOnly: false,
    value: null
};
