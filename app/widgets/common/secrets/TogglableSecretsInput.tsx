import type { ChangeEvent } from 'react';
import React from 'react';
import type { InputOnChangeData, TextAreaProps } from 'semantic-ui-react';
import { UnmaskableSecretInput } from 'cloudify-ui-components';
import type { MultilineInputProps } from './MultilineInput';
import MultilineInput from './MultilineInput';

interface TogglableSecretsInputProps extends Omit<MultilineInputProps, 'onChange'> {
    showMultilineInput?: boolean;
    onChange: (
        event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        data: TextAreaProps | InputOnChangeData
    ) => void;
}

const TogglableSecretsInput = (props: TogglableSecretsInputProps) => {
    const { showMultilineInput } = props;
    return showMultilineInput ? <MultilineInput {...props} /> : <UnmaskableSecretInput {...props} />;
};

export default TogglableSecretsInput;
