const allowedCharacters = /^[a-z][a-z0-9._-]*$/i;

function useLabelInput(onChange, initialValue = '') {
    const { useBoolean, useResettableState } = Stage.Hooks;
    const [inputValue, setInputValue, resetInputValue] = useResettableState(initialValue);
    const [isInvalidCharacterTyped, setInvalidCharacterTyped, unsetInvalidCharacterTyped] = useBoolean();

    return {
        inputValue,
        isInvalidCharacterTyped,
        submitChange: (event, data) => {
            // supports both dropdown as well as regular input
            const lowercasedNewTypedValue = _.toLower(data.searchQuery ?? data.value);
            if (lowercasedNewTypedValue === '' || allowedCharacters.test(lowercasedNewTypedValue)) {
                setInputValue(lowercasedNewTypedValue);
                onChange(lowercasedNewTypedValue);
                unsetInvalidCharacterTyped();
            } else {
                setInvalidCharacterTyped();
            }
        },
        resetInput: () => {
            resetInputValue();
            unsetInvalidCharacterTyped();
        },
        unsetInvalidCharacterTyped
    };
}

Stage.defineHook({ useLabelInput });
