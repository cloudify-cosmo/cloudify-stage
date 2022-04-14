import { PositionedRevertToDefaultIcon } from './RevertToDefaultIcon';
import type { ErrorAwareInputFieldProps, RevertableInputFieldProps } from './types';

type ValueListInputFieldProps = ErrorAwareInputFieldProps &
    RevertableInputFieldProps & {
        validValues: any[];
    };

export default function ValueListInputField(props: ValueListInputFieldProps) {
    const { Form } = Stage.Basic;
    const { name, value, onChange, error, validValues } = props;

    const options = _.map(validValues, validValue => ({
        name: validValue,
        text: validValue,
        value: validValue
    }));

    return (
        <div style={{ position: 'relative' }}>
            <Form.Dropdown
                name={name}
                value={value}
                fluid
                selection
                error={error}
                options={options}
                onChange={onChange}
            />
            <PositionedRevertToDefaultIcon {...props} right={30} />
        </div>
    );
}
