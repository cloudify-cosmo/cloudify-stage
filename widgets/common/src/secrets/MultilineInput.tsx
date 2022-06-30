import type { FormTextAreaProps } from 'semantic-ui-react';

type MultilineInputProps = Pick<FormTextAreaProps, 'name' | 'placeholder' | 'value' | 'onChange'>;

const { Form } = Stage.Basic;
const minFieldRows = 10;

const MultilineInput = ({ name, placeholder, value, onChange }: MultilineInputProps) => {
    return (
        <Form.TextArea name={name} placeholder={placeholder} value={value} onChange={onChange} rows={minFieldRows} />
    );
};

export default MultilineInput;
