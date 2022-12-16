import React from 'react';
import DynamicDropdown from '../../components/DynamicDropdown';
import type { DynamicDropdownInputFieldProps } from './types';
import translateInputs from '../utils/translateInputs';

export default function CapabilityValueInputField({
    name,
    value,
    onChange,
    toolbox,
    error,
    constraints
}: DynamicDropdownInputFieldProps) {
    const fetchUrl = '/searches/capabilities';

    const formatDeploymentsToCapabilities = (deployments: any[]) =>
        deployments?.[0]?.capabilities?.map((capability: Record<string, any>) => ({
            ...Object.values(capability)[0]
        })) ?? [];

    return (
        <DynamicDropdown
            name={name}
            error={error}
            placeholder={translateInputs('types.capability_value.placeholder')}
            itemsFormatter={formatDeploymentsToCapabilities}
            value={value}
            valueProp="value"
            fetchUrl={fetchUrl}
            onChange={newValue => onChange?.(null, { name, value: newValue })}
            toolbox={toolbox}
            constraints={constraints}
        />
    );
}
