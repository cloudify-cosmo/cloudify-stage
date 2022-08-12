import type { ChangeEvent } from 'react';
import type { InputOnChangeData, TextAreaProps } from 'semantic-ui-react';
import type { MultilineInputProps } from './MultilineInput';
import MultilineInput from './MultilineInput';
import SinglelineInput from './SinglelineInput';

interface TogglableSecretsInputProps extends Omit<MultilineInputProps, 'onChange'> {
    showMultilineInput?: boolean;
    onChange: (
        event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        data: TextAreaProps | InputOnChangeData
    ) => void;
}

const TogglableSecretsInput = ({
    name,
    placeholder,
    value,
    onChange,
    showMultilineInput
}: TogglableSecretsInputProps) => {
    return showMultilineInput ? (
        <MultilineInput name={name} placeholder={placeholder} value={value} onChange={onChange} />
    ) : (
        <SinglelineInput name={name} value={value} onChange={onChange} />
    );
};

export default TogglableSecretsInput;