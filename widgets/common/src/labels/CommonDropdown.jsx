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

export default function CommonDropdown({ innerRef, baseFetchUrl, onChange, toolbox, readOnly, value, ...rest }) {
    const { useEffect, useState } = React;
    const {
        Common: { DynamicDropdown },
        Hooks: { useLabelInput }
    } = Stage;

    const [fetchUrl, setFetchUrl] = useState(baseFetchUrl);
    const {
        inputValue,
        invalidCharacterTyped,
        submitChange,
        resetInput,
        unsetInvalidCharacterTyped
    } = useLabelInput(onChange, { readOnly });

    useDebouncedSetValue(readOnly ? baseFetchUrl : addSearchToUrl(baseFetchUrl, inputValue), setFetchUrl, [
        baseFetchUrl,
        inputValue,
        readOnly
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
                onSearchChange={readOnly ? undefined : submitChange}
                searchQuery={readOnly ? undefined : inputValue}
                selectOnNavigation={readOnly}
                toolbox={toolbox}
                value={readOnly ? value : undefined}
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
    readOnly: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
};

CommonDropdown.defaultProps = {
    innerRef: null,
    readOnly: false,
    value: null
};
