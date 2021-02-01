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

export default function CommonDropdown({ baseFetchUrl, onChange, toolbox, value, ...rest }) {
    const { useEffect, useState } = React;
    const {
        Common: { DynamicDropdown },
        Hooks: { useBoolean, useResettableState }
    } = Stage;

    const [selectedValue, setSelectedValue, resetSelectedValue] = useResettableState('');
    const [typedValue, setTypedValue, resetTypedValue] = useResettableState('');
    const [showError, setShowError, unsetShowError] = useBoolean();
    const [fetchUrl, setFetchUrl] = useState(baseFetchUrl);

    function onSearchChange(event, { searchQuery: newTypedValue }) {
        const allowedCharacters = /^[a-z][a-z0-9._-]*$/i;
        const lowercasedNewTypedValue = _.toLower(newTypedValue);

        if (lowercasedNewTypedValue === '' || allowedCharacters.test(lowercasedNewTypedValue)) {
            resetSelectedValue();
            setTypedValue(lowercasedNewTypedValue);
            onChange(lowercasedNewTypedValue);
            unsetShowError();
        } else {
            setShowError();
        }
    }

    function onValueChange(newValue) {
        resetTypedValue();
        setSelectedValue(newValue);
        onChange(newValue);
        unsetShowError();
    }

    useDebouncedSetValue(baseFetchUrl ? addSearchToUrl(baseFetchUrl, typedValue) : '', setFetchUrl, [
        baseFetchUrl,
        typedValue
    ]);

    useEffect(() => {
        if (_.isEmpty(value)) {
            resetSelectedValue();
            resetTypedValue();
            unsetShowError();
        }
    }, [value]);

    return (
        <>
            <ValidationErrorPopup open={showError} />

            <DynamicDropdown
                clearable={false}
                fetchAll
                fetchUrl={fetchUrl}
                onBlur={unsetShowError}
                onChange={onValueChange}
                onSearchChange={onSearchChange}
                searchQuery={typedValue}
                toolbox={toolbox}
                value={selectedValue}
                valueProp=""
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
