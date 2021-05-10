import { SyntheticEvent } from 'react';
import type { DropdownProps } from 'semantic-ui-react';

const allowedCharacters = /^[a-z][a-z0-9._-]*$/i;
const maxInputLength = 256;

// TODO: Add proper typing for onChange function
function useLabelInput(onChange: (value: any) => void, { allowAnyValue = false, initialValue = '' }) {
    const { useBoolean, useResettableState } = Stage.Hooks;
    const [inputValue, setInputValue, resetInputValue] = useResettableState(initialValue);
    const [invalidCharacterTyped, setInvalidCharacterTyped, unsetInvalidCharacterTyped] = useBoolean();

    return {
        inputValue,
        invalidCharacterTyped,
        submitChange: (_event: SyntheticEvent | null, data: DropdownProps) => {
            if (allowAnyValue) {
                onChange(data.value);
                resetInputValue();
                return;
            }

            // supports both dropdown as well as regular input
            const lowercasedNewTypedValue = _.toLower((data.searchQuery as string) ?? (data.value as string)).substr(
                0,
                maxInputLength
            );
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
            onChange(initialValue);
            if (!allowAnyValue) unsetInvalidCharacterTyped();
        },
        unsetInvalidCharacterTyped
    };
}

declare global {
    namespace Stage {
        interface Hooks {
            useLabelInput: typeof useLabelInput;
        }
    }
}

// NOTE: prevents leaking variables as global in TS
export {};

Stage.defineHook({ useLabelInput });
