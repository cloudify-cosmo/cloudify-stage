import type { FormInputProps } from 'semantic-ui-react';

// TODO: Simplify props typing
export interface PasswordFieldProps extends Pick<FormInputProps, 'name' | 'onChange'> {
    value?: FormInputProps['value'];
    fluid?: FormInputProps['fluid'];
    disabled?: FormInputProps['disabled'];
    style?: FormInputProps['style'];
    children?: FormInputProps['children'];
}

const { Form, Icon } = Stage.Basic;
const { useToggle } = Stage.Hooks;

// TODO: Rething if the name will be appropriate after adding toggling functionality
const PasswordField = ({ name, value, onChange, disabled, fluid, style, children }: PasswordFieldProps) => {
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
        >
            {children}
        </Form.Input>
    );
};

export default PasswordField;
