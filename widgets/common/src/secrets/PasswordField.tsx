import type { FormInputProps } from 'semantic-ui-react';
import PasswordMaskIcon from './PasswordMaskIcon';

type PasswordFieldProps = Partial<
    Pick<FormInputProps, 'onChange' | 'name' | 'value' | 'fluid' | 'style' | 'maxLength' | 'disabled'>
>;

const { Form } = Stage.Basic;
const { useToggle } = Stage.Hooks;

const PasswordField = ({ name, value, onChange, disabled, fluid, style, maxLength }: PasswordFieldProps) => {
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
            maxLength={maxLength}
            icon={<PasswordMaskIcon isPasswordMasked={isPasswordMasked} onClick={togglePasswordVisibility} />}
        />
    );
};

export default PasswordField;
