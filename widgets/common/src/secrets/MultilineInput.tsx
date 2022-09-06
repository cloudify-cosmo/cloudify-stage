import type { FormTextAreaProps } from 'semantic-ui-react';

export type MultilineInputProps = Pick<FormTextAreaProps, 'name' | 'placeholder' | 'value' | 'onChange' | 'width'>;

const { Form } = Stage.Basic;
const minFieldRows = 10;

const MultilineInput = ({ name, placeholder, value, onChange, width }: MultilineInputProps) => {
    return (
        <Form.TextArea
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={minFieldRows}
            width={width}
        />
    );
};

export default MultilineInput;
