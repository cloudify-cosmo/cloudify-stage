import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import type { DropdownItemProps } from 'semantic-ui-react';
import { Dropdown } from '../../../../components/basic';

interface MultipleStringValuesInputProps {
    name: string;
    onChange: (newValue: string[]) => void;
    placeholder: string;
    value: string[];
}

const MultipleStringValuesInput: FunctionComponent<MultipleStringValuesInputProps> = ({
    name,
    onChange,
    placeholder,
    value
}) => {
    const options = useMemo(
        () => value.map((element): DropdownItemProps => ({ text: element, value: element })),
        [value]
    );

    return (
        <Dropdown
            name={name}
            allowAdditions
            clearable
            fluid
            multiple
            options={options}
            placeholder={placeholder}
            search
            selection
            onChange={(_event, data) => onChange(data.value as string[])}
            value={value}
        />
    );
};
export default MultipleStringValuesInput;
