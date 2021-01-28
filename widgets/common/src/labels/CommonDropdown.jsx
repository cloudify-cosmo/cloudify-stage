import { addSearchToUrl } from './common';
import ValidationErrorPopup from './ValidationErrorPopup';

const { useCallback, useEffect, useState } = React;

const {
    Hooks: { useBoolean, useResettableState }
} = Stage;

function onSearchChange(onChange, setSearchQuery, setShowError, unsetShowError, resetSelectedValue, setTypedValue) {
    const allowedCharacters = /^[a-z0-9_-]*$/i;

    return (event, { searchQuery: newTypedValue }) => {
        const lowercasedNewTypedValue = _.toLower(newTypedValue);
        if (allowedCharacters.test(lowercasedNewTypedValue)) {
            resetSelectedValue();
            setTypedValue(lowercasedNewTypedValue);
            onChange(lowercasedNewTypedValue);
            unsetShowError();
        } else {
            setShowError();
        }
    };
}

function onValueChange(onChange, unsetShowError, resetTypedValue, setSelectedValue) {
    return value => {
        resetTypedValue();
        setSelectedValue(value);
        onChange(value);
        unsetShowError();
    };
}

function useResetValues(value, selectedValue, typedValue, resetSelectedValue, resetTypedValue) {
    useEffect(() => {
        if (value === '') {
            resetSelectedValue();
            resetTypedValue();
        }
    }, [value]);
}

function useDebouncedSetValue(value, setValue, deps) {
    const delay = 500; // ms
    const debouncedSet = useCallback(_.debounce(setValue, delay), []);
    useEffect(() => {
        debouncedSet(value);
    }, deps);
}

export default function CommonDropdown({ baseFetchUrl, onChange, toolbox, value, ...rest }) {
    const [selectedValue, setSelectedValue, resetSelectedValue] = useResettableState('');
    const [typedValue, setTypedValue, resetTypedValue] = useResettableState('');
    const [showError, setShowError, unsetShowError] = useBoolean();
    const [fetchUrl, setFetchUrl] = useState(baseFetchUrl);

    const { DynamicDropdown } = Stage.Common;

    useDebouncedSetValue(baseFetchUrl ? addSearchToUrl(baseFetchUrl, typedValue) : '', setFetchUrl, [
        baseFetchUrl,
        typedValue
    ]);
    useResetValues(value, selectedValue, typedValue, resetSelectedValue, resetTypedValue);

    return (
        <>
            <ValidationErrorPopup open={showError} />

            <DynamicDropdown
                clearable={false}
                fetchAll
                fetchUrl={fetchUrl}
                onChange={onValueChange(onChange, unsetShowError, resetTypedValue, setSelectedValue)}
                onSearchChange={onSearchChange(
                    onChange,
                    setTypedValue,
                    setShowError,
                    unsetShowError,
                    resetSelectedValue,
                    setTypedValue
                )}
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
