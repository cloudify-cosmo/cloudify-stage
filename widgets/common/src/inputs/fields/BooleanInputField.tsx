import RevertToDefaultIcon from './RevertToDefaultIcon';
import { RevertableInputFieldProps } from './types';

export default function BooleanInputField(props: RevertableInputFieldProps) {
    const { Form } = Stage.Basic;
    const { name, value, onChange } = props;
    const isBooleanValue = value === false || value === true;
    const checked = isBooleanValue ? value : undefined;

    return (
        <>
            <Form.Checkbox
                name={name}
                toggle
                label={name}
                checked={checked}
                indeterminate={!isBooleanValue}
                onChange={onChange}
                help={undefined}
            />
            &nbsp;&nbsp;&nbsp;
            <RevertToDefaultIcon {...props} />
        </>
    );
}
