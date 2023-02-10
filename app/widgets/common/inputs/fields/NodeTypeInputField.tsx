import React from 'react';
import DynamicDropdown from '../../components/DynamicDropdown';
import type { DynamicDropdownInputFieldProps } from './types';
import useFetchUrlWithIdFromContext from './useFetchUrlWithIdFromContext';
import translateInputs from '../utils/translateInputs';

export default function NodeTypeInputField({ name, onChange, toolbox, ...restProps }: DynamicDropdownInputFieldProps) {
    const fetchUrl = useFetchUrlWithIdFromContext('/searches/node-types?_include=type', restProps.constraints);

    return (
        <DynamicDropdown
            valueProp="type"
            placeholder={translateInputs('types.node_type.placeholder')}
            fetchUrl={fetchUrl}
            onChange={newValue => onChange?.(null, { name, value: newValue })}
            toolbox={toolbox}
            {...restProps}
        />
    );
}
