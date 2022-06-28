import type { FormInputProps } from 'semantic-ui-react';

export interface PasswordFieldProps extends Pick<FormInputProps, 'name' | 'onChange'> {
    value?: FormInputProps['value'];
}

const { Form } = Stage.Basic;

// TODO: Rething if the name will be appropriate after adding toggling functionality
const PasswordField = ({ name, value, onChange }: PasswordFieldProps) => {
    return <Form.Input type="password" name={name} value={value} onChange={onChange} />;
};

export default PasswordField;
