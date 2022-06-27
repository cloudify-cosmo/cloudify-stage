import type { FormTextAreaProps } from 'semantic-ui-react';

type PasswordFieldProps = Pick<FormTextAreaProps, 'name' | 'placeholder' | 'value' | 'onChange'>;

const { Form } = Stage.Basic;

// TODO: Rething if the name will be appropriate after adding toggling functionality
const PasswordField = ({ name, placeholder, value, onChange }: PasswordFieldProps) => {
    return <Form.Field type="password" name={name} placeholder={placeholder} value={value} onChange={onChange} />;
};

export default PasswordField;
