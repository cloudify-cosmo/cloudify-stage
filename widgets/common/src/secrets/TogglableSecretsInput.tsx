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

const TogglableSecretsInput = (props: TogglableSecretsInputProps) => {
    const { showMultilineInput } = props;
    return showMultilineInput ? <MultilineInput {...props} /> : <SinglelineInput {...props} />;
};

export default TogglableSecretsInput;
