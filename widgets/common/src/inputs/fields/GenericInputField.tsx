import { PositionedRevertToDefaultIcon } from './RevertToDefaultIcon';
import type { ErrorAwareInputFieldProps, RevertableInputFieldProps } from './types';

export default function GenericInputField(props: ErrorAwareInputFieldProps & RevertableInputFieldProps) {
    const { Form } = Stage.Basic;
    const { name, value, onChange, error } = props;
    return (
        <>
            <Form.Json name={name} value={value} onChange={onChange} error={error} />
            <PositionedRevertToDefaultIcon {...props} />
        </>
    );
}
