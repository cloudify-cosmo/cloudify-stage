import type { FormInputProps } from 'semantic-ui-react';

export interface PasswordFieldProps extends Pick<FormInputProps, 'name' | 'onChange'> {
    value?: FormInputProps['value'];
}

const { Form, Icon } = Stage.Basic;
const { useToggle } = Stage.Hooks;

// TODO: Rething if the name will be appropriate after adding toggling functionality
const PasswordField = ({ name, value, onChange }: PasswordFieldProps) => {
    const [isPasswordMasked, togglePasswordVisibility] = useToggle(true);
    return (
        <Form.Input
            type={isPasswordMasked ? 'password' : 'text'}
            name={name}
            value={value}
            onChange={onChange}
            icon={<Icon name={isPasswordMasked ? 'eye slash' : 'eye'} onClick={togglePasswordVisibility} link />}
        />
    );
};

export default PasswordField;
