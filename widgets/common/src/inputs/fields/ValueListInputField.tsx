import type { DropdownProps } from 'semantic-ui-react';
import { PositionedRevertToDefaultIcon } from './RevertToDefaultIcon';
import type { ErrorAwareInputFieldProps, RevertableInputFieldProps } from './types';

type ValueListInputFieldProps = ErrorAwareInputFieldProps &
    RevertableInputFieldProps & {
        validValues: any[];
        multiple: boolean;
    };

export default function ValueListInputField(props: ValueListInputFieldProps) {
    const { Form } = Stage.Basic;
    const { name, value, onChange, error, validValues, multiple = false, defaultValue } = props;

    // TODO Norbert: rename arguments
    const isStringifiedNumber = (numericValue: any): boolean => {
        return typeof numericValue === 'string' && !Number.isNaN(+numericValue);
    };

    // TODO Norbert: Extract option value getter
    const options = _.map(validValues, validValue => {
        const parsedOptionValue = isStringifiedNumber(validValue) ? `"${validValue}"` : validValue;

        return {
            name: validValue,
            text: validValue,
            value: parsedOptionValue
        };
    });

    const handleChange: DropdownProps['onChange'] = (event, data) => {
        // TODO Norbert: Use for recording previous/current results
        // if (name === 'infra_name') {
        //     // eslint-disable-next-line
        //     console.log('='.repeat(25));
        //     // eslint-disable-next-line
        //     console.log('options');
        //     // eslint-disable-next-line
        //     console.log(options);

        //     // eslint-disable-next-line
        //     console.log('defaultValue');
        //     // eslint-disable-next-line
        //     console.log(defaultValue);

        //     // eslint-disable-next-line
        //     console.log('data.value');
        //     // eslint-disable-next-line
        //     console.log(data.value);
        //     // eslint-disable-next-line
        //     console.log(typeof data.value);
        // }
        onChange?.(event, data);
    };

    return (
        <>
            <Form.Dropdown
                name={name}
                value={value}
                fluid
                selection
                error={error}
                options={options}
                onChange={handleChange}
                multiple={multiple}
                defaultValue={defaultValue}
            />
            <PositionedRevertToDefaultIcon {...props} right={30} />
        </>
    );
}
