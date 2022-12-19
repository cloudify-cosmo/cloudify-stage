import React from 'react';
import DynamicDropdown from '../../components/DynamicDropdown';
import type { DynamicDropdownInputFieldProps } from './types';
import StageUtils from '../../../../utils/stageUtils';
import translateInputs from '../utils/translateInputs';

export default function DeploymentIdInputField({
    name,
    value,
    onChange,
    ...restProps
}: DynamicDropdownInputFieldProps) {
    const fetchUrl = '/deployments?_include=id,display_name';

    return (
        <DynamicDropdown
            name={name}
            textFormatter={item => StageUtils.formatDisplayName({ id: item.id, displayName: item.display_name })}
            placeholder={translateInputs('types.deployment_id.placeholder')}
            value={value}
            fetchUrl={fetchUrl}
            onChange={newValue => onChange?.(null, { name, value: newValue })}
            {...restProps}
        />
    );
}
