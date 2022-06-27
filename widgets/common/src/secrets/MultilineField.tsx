import type { FormTextAreaProps } from 'semantic-ui-react';

type MultilineFieldProps = Pick<FormTextAreaProps, 'name' | 'placeholder' | 'value' | 'onChange'>;

const { Form } = Stage.Basic;
const minFieldRows = 10;

const MultilineField = ({ name, placeholder, value, onChange }: MultilineFieldProps) => {
    return (
        <Form.TextArea name={name} placeholder={placeholder} value={value} onChange={onChange} rows={minFieldRows} />
    );
};

export default MultilineField;
