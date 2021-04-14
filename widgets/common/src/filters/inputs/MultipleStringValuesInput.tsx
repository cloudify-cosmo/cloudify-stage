import { FunctionComponent, useMemo } from 'react';

interface MultipleStringValuesInputProps {
    value: string[];
    onChange: (newValue: string[]) => void;
}

const MultipleStringValuesInput: FunctionComponent<MultipleStringValuesInputProps> = ({ onChange, value }) => {
    const { Dropdown } = Stage.Basic;
    const options = useMemo(() => value.map(element => ({ text: element, value: element })), [value]);

    return (
        <Dropdown
            allowAdditions
            clearable
            fluid
            multiple
            options={options}
            search
            selection
            onChange={(_event, data) => onChange(data.value as string[])}
            value={value}
        />
    );
};
export default MultipleStringValuesInput;
