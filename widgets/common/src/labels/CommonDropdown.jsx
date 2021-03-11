import { addSearchToUrl } from './common';
import ValidationErrorPopup from './ValidationErrorPopup';

function useDebouncedSetValue(value, setValue, deps) {
    const { useCallback, useEffect } = React;
    const delayMs = 500;
    const debouncedSet = useCallback(_.debounce(setValue, delayMs), []);

    useEffect(() => {
        debouncedSet(value);
    }, deps);
}

export default function CommonDropdown({ innerRef, baseFetchUrl, onChange, toolbox, value, ...rest }) {
    const { useEffect, useState } = React;
    const {
        Common: { DynamicDropdown },
        Hooks: { useLabelInput }
    } = Stage;

    const [fetchUrl, setFetchUrl] = useState(baseFetchUrl);
    const { inputValue, invalidCharacterTyped, submitChange, resetInput, unsetInvalidCharacterTyped } = useLabelInput(
        onChange
    );

    useDebouncedSetValue(baseFetchUrl ? addSearchToUrl(baseFetchUrl, inputValue) : '', setFetchUrl, [
        baseFetchUrl,
        inputValue
    ]);

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
                onSearchChange={submitChange}
                searchQuery={inputValue}
                selectOnNavigation={false}
                toolbox={toolbox}
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...rest}
            />
        </>
    );
}

CommonDropdown.propTypes = {
    baseFetchUrl: PropTypes.string.isRequired,
    innerRef: PropTypes.shape({ current: PropTypes.instanceOf(HTMLElement) }),
    onChange: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    value: PropTypes.string
};

CommonDropdown.defaultProps = {
    innerRef: null,
    value: null
};
