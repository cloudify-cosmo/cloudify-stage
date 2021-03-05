import { addSearchToUrl } from './common';

function useDebouncedSetValue(value, setValue, deps) {
    const { useCallback, useEffect } = React;
    const delayMs = 500;
    const debouncedSet = useCallback(_.debounce(setValue, delayMs), []);

    useEffect(() => {
        debouncedSet(value);
    }, deps);
}

export default function CommonDropdown({ baseFetchUrl, onChange, toolbox, value, ...rest }) {
    const { useEffect, useState } = React;
    const {
        Common: { DynamicDropdown, LabelValidationErrorPopup },
        Hooks: { useLabelInput, useResettableState }
    } = Stage;

    const [selectedValue, setSelectedValue, resetSelectedValue] = useResettableState('');
    const [fetchUrl, setFetchUrl] = useState(baseFetchUrl);
    const { inputValue, invalidCharacterTyped, submitChange, resetInput, unsetInvalidCharacterTyped } = useLabelInput(
        newValue => {
            resetSelectedValue();
            onChange(newValue);
        }
    );

    function onValueChange(newValue) {
        resetInput();
        setSelectedValue(newValue);
        onChange(newValue);
    }

    useDebouncedSetValue(baseFetchUrl ? addSearchToUrl(baseFetchUrl, inputValue) : '', setFetchUrl, [
        baseFetchUrl,
        inputValue
    ]);

    useEffect(() => {
        if (_.isEmpty(value)) {
            resetSelectedValue();
            resetInput();
        }
    }, [value]);

    return (
        <>
            <LabelValidationErrorPopup open={invalidCharacterTyped} />

            <DynamicDropdown
                clearable={false}
                fetchUrl={fetchUrl}
                itemsFormatter={items => _.map(items, item => ({ id: item }))}
                onBlur={unsetInvalidCharacterTyped}
                onChange={onValueChange}
                onSearchChange={submitChange}
                searchQuery={inputValue}
                selectOnNavigation={false}
                toolbox={toolbox}
                value={selectedValue}
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...rest}
            />
        </>
    );
}

CommonDropdown.propTypes = {
    baseFetchUrl: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    value: PropTypes.string
};

CommonDropdown.defaultProps = {
    value: null
};
