import type { FormTextAreaProps } from 'semantic-ui-react';

type MultilineFieldProps = Pick<FormTextAreaProps, 'name' | 'placeholder' | 'value' | 'onChange'>;

const { Form } = Stage.Basic;

const MultilineField = ({ name, placeholder, value, onChange }: MultilineFieldProps) => {
    return <Form.TextArea name={name} placeholder={placeholder} autoHeight value={value} onChange={onChange} />;
};

export default MultilineField;
