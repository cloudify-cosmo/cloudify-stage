import React, { useEffect } from 'react';
import type { CustomConfigurationComponentProps } from 'app/utils/StageAPI';
import type { Capability } from './widget.types';

interface CapabilityBlueprintDefaultInputProps extends CustomConfigurationComponentProps<boolean> {
    rowValues?: Capability;
}

export default function CapabilityBlueprintDefaultInput({
    rowValues,
    name,
    value,
    onChange
}: CapabilityBlueprintDefaultInputProps) {
    const { Form } = Stage.Basic;

    useEffect(() => {
        if (rowValues?.source === 'static') onChange(undefined, { name, value: true });
    }, [rowValues?.source]);

    return (
        <Form.Checkbox
            disabled={rowValues?.source === 'static'}
            checked={value}
            onChange={(event, { checked }) => onChange(event, { name, value: !!checked })}
            label=" "
        />
    );
}
