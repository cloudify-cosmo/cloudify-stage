import type { StrictTextAreaProps } from 'semantic-ui-react';

type MultilineFieldProps = Pick<StrictTextAreaProps, 'value' | 'onChange'>;

const { Form } = Stage.Basic;

const MultilineField = ({ onChange, value }: MultilineFieldProps) => {
    return <Form.TextArea name="secretValue" placeholder="Secret value" autoHeight value={value} onChange={onChange} />;
};

export default MultilineField;
