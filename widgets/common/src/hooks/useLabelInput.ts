import { SyntheticEvent } from 'react';
import type { LabelInputType } from '../labels/types';

const allowedCharactersForLabelKey = /^[a-z0-9._-]*$/i;
const allowedCharactersForLabelValue = /^[^\p{C}"]*$/u;
const maxInputLength = 256;

function removeControlCharacters(value: string) {
    return value.replace(/\p{C}/gu, '');
}

function formatNewValue(type: LabelInputType, newValue: string) {
    const truncatedNewValue = newValue.substr(0, maxInputLength);
    return type === 'key' ? truncatedNewValue.toLowerCase() : removeControlCharacters(truncatedNewValue);
}

function useLabelInput(onChange: (value: string) => void, type: LabelInputType, { initialValue = '' } = {}) {
    const { useBoolean, useResettableState } = Stage.Hooks;
    const [inputValue, setInputValue, resetInputValue] = useResettableState(initialValue);
    const [invalidCharacterTyped, setInvalidCharacterTyped, unsetInvalidCharacterTyped] = useBoolean();

    const allowedCharacters = type === 'key' ? allowedCharactersForLabelKey : allowedCharactersForLabelValue;

    return {
        inputValue,
        invalidCharacterTyped,
        submitChange: (_event: SyntheticEvent | null, data: { value: string; searchQuery?: string }) => {
            // supports both dropdown as well as regular input
            const formattedNewValue = formatNewValue(type, data.searchQuery! ?? data.value);

            if (formattedNewValue === '' || allowedCharacters.test(formattedNewValue)) {
                setInputValue(formattedNewValue);
                onChange(formattedNewValue);
                unsetInvalidCharacterTyped();
            } else {
                setInvalidCharacterTyped();
            }
        },
        resetInput: () => {
            resetInputValue();
            onChange(initialValue);
            unsetInvalidCharacterTyped();
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

Stage.defineHook({ useLabelInput });
