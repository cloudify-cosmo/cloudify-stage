import React from 'react';
import DynamicDropdown from '../../components/DynamicDropdown';
import type { DynamicDropdownInputFieldProps } from './types';
import useFetchUrlWithIdFromContext from './useFetchUrlWithIdFromContext';
import translateInputs from '../utils/translateInputs';

export default function NodeInstanceInputField({
    name,
    onChange,
    toolbox,
    ...restProps
}: DynamicDropdownInputFieldProps) {
    const fetchUrl = useFetchUrlWithIdFromContext('/searches/node-instances', restProps.constraints);

    return (
        <DynamicDropdown
            placeholder={translateInputs('types.node_instance.placeholder')}
            fetchUrl={fetchUrl}
            onChange={newValue => onChange?.(null, { name, value: newValue })}
            toolbox={toolbox}
            {...restProps}
        />
    );
}
