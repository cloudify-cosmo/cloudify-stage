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

export default function CommonDropdown({ innerRef, baseFetchUrl, onChange, toolbox, allowKnownOnly, value, ...rest }) {
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
    } = useLabelInput(onChange, { allowKnownOnly });

    useDebouncedSetValue(allowKnownOnly ? baseFetchUrl : addSearchToUrl(baseFetchUrl, inputValue), setFetchUrl, [
        baseFetchUrl,
        inputValue,
        allowKnownOnly
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
    baseFetchUrl: PropTypes.string.isRequired,
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
