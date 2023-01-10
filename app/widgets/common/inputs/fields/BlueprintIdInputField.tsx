import React from 'react';
import DynamicDropdown from '../../components/DynamicDropdown';
import type { DynamicDropdownInputFieldProps } from './types';
import translateInputs from '../utils/translateInputs';

export default function BlueprintIdInputField({ name, value, onChange, ...restProps }: DynamicDropdownInputFieldProps) {
    const fetchUrl = '/searches/blueprints?_include=id&state=uploaded';

    return (
        <DynamicDropdown
            name={name}
            placeholder={translateInputs('types.blueprint_id.placeholder')}
            value={value}
            fetchUrl={fetchUrl}
            onChange={newValue => onChange?.(null, { name, value: newValue })}
            {...restProps}
        />
    );
}
