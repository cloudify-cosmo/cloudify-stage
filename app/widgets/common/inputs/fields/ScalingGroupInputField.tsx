import React from 'react';
import DynamicDropdown from '../../components/DynamicDropdown';
import type { DynamicDropdownInputFieldProps } from './types';
import useFetchUrlWithIdFromContext from './useFetchUrlWithIdFromContext';
import translateInputs from '../utils/translateInputs';

export default function ScalingGroupInputField({
    name,
    onChange,
    toolbox,
    ...restProps
}: DynamicDropdownInputFieldProps) {
    const fetchUrl = useFetchUrlWithIdFromContext('/searches/scaling-groups?_include=name', restProps.constraints);

    return (
        <DynamicDropdown
            valueProp="name"
            placeholder={translateInputs('types.scaling_group.placeholder')}
            fetchUrl={fetchUrl}
            onChange={newValue => onChange?.(null, { name, value: newValue })}
            toolbox={toolbox}
            {...restProps}
        />
    );
}
