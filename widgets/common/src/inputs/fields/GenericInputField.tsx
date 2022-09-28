import { PositionedRevertToDefaultIcon } from './RevertToDefaultIcon';
import type { ErrorAwareInputFieldProps, RevertableInputFieldProps } from './types';

export default function GenericInputField(props: ErrorAwareInputFieldProps & RevertableInputFieldProps) {
    const { Form } = Stage.Basic;
    const { name, value, onChange, error } = props;

    return (
        <>
            {/* @ts-ignore TODO(RD-5721) Remove this ignore once Form is fully migrated to TypeScript */}
            <Form.Json name={name} value={value} onChange={onChange} error={error} />
            <PositionedRevertToDefaultIcon {...props} />
        </>
    );
}
