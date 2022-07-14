import { PositionedRevertToDefaultIcon } from './RevertToDefaultIcon';
import type { ErrorAwareInputFieldProps, RevertableInputFieldProps } from './types';

type ValueListInputFieldProps = ErrorAwareInputFieldProps &
    RevertableInputFieldProps & {
        validValues: any[];
        multiple: boolean;
    };

const isStringifiedNumber = (value: unknown): boolean => {
    return typeof value === 'string' && !Number.isNaN(+value);
};

const parseOptionValue = (value: ValueListInputFieldProps['validValues'][0]) => {
    return isStringifiedNumber(value) ? `"${value}"` : value;
};

export default function ValueListInputField(props: ValueListInputFieldProps) {
    const { Form } = Stage.Basic;
    const { name, value, onChange, error, validValues, multiple = false, defaultValue } = props;

    const options = _.map(validValues, validValue => {
        const parsedOptionValue = parseOptionValue(validValue);

        return {
            name: validValue,
            text: validValue,
            value: parsedOptionValue
        };
    });

    return (
        <>
            <Form.Dropdown
                name={name}
                value={value}
                fluid
                selection
                error={error}
                options={options}
                onChange={onChange}
                multiple={multiple}
                defaultValue={defaultValue}
            />
            <PositionedRevertToDefaultIcon {...props} right={30} />
        </>
    );
}
