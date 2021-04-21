import ValidationErrorPopup from './ValidationErrorPopup';

export default function CommonDropdown({ innerRef, fetchUrl, onChange, toolbox, allowAdditions, value, ...rest }) {
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
    } = useLabelInput(onChange, { allowAnyValue: allowAdditions });

    useEffect(() => {
        if (_.isEmpty(value)) {
            resetInput();
        }
    }, [value]);

    return (
        <>
            {invalidCharacterTyped && <ValidationErrorPopup />}

            <DynamicDropdown
                allowAdditions={allowAdditions}
                innerRef={innerRef}
                clearable={false}
                fetchUrl={fetchUrl}
                itemsFormatter={items => _.map(items, item => ({ id: item }))}
                onBlur={unsetInvalidCharacterTyped}
                onChange={newValue => submitChange(null, { value: newValue })}
                onSearchChange={allowAdditions ? undefined : submitChange}
                searchQuery={allowAdditions ? undefined : inputValue}
                selectOnNavigation={allowAdditions}
                toolbox={toolbox}
                value={allowAdditions ? value : undefined}
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
    allowAdditions: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
};

CommonDropdown.defaultProps = {
    innerRef: null,
    allowAdditions: false,
    value: null
};
