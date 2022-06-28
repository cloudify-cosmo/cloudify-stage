import type { FormInputProps } from 'semantic-ui-react';

export interface PasswordFieldProps extends Pick<FormInputProps, 'name' | 'onChange'> {
    value?: FormInputProps['value'];
    fluid?: FormInputProps['fluid'];
    disabled?: FormInputProps['disabled'];
    style?: FormInputProps['style'];
}

const { Form, Icon } = Stage.Basic;
const { useToggle } = Stage.Hooks;

// TODO: Rething if the name will be appropriate after adding toggling functionality
const PasswordField = ({ name, value, onChange, disabled, fluid, style }: PasswordFieldProps) => {
    const [isPasswordMasked, togglePasswordVisibility] = useToggle(true);
    return (
        <Form.Input
            type={isPasswordMasked ? 'password' : 'text'}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            fluid={fluid}
            style={style}
            icon={<Icon name={isPasswordMasked ? 'eye slash' : 'eye'} onClick={togglePasswordVisibility} link />}
        />
    );
};

export default PasswordField;
