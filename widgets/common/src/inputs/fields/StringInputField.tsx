import RevertToDefaultIcon, { PositionedRevertToDefaultIcon } from './RevertToDefaultIcon';
import { ErrorAwareInputFieldProps, RevertableInputFieldProps } from './types';

export default function StringInputField(props: ErrorAwareInputFieldProps & RevertableInputFieldProps) {
    const { Form } = Stage.Basic;
    const { name, value, onChange, error } = props;

    return _.includes(value, '\n') ? (
        <div style={{ position: 'relative' }}>
            <Form.TextArea name={name} value={value} onChange={onChange} />
            <PositionedRevertToDefaultIcon {...props} />
        </div>
    ) : (
        <Form.Input
            name={name}
            value={value}
            fluid
            error={error}
            icon={<RevertToDefaultIcon {...props} />}
            onChange={onChange}
        />
    );
}
