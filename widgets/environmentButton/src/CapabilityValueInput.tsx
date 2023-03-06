import React from 'react';
import type { CustomConfigurationComponentProps } from 'app/utils/StageAPI';
import type { Capability } from './widget.types';

interface CapabilityValueInputProps extends CustomConfigurationComponentProps<string> {
    rowValues?: Capability;
}

export default function CapabilityValueInput({
    rowValues,
    name,
    value,
    onChange,
    widgetlessToolbox
}: CapabilityValueInputProps) {
    const { Form } = Stage.Basic;
    const { DynamicDropdown } = Stage.Common.Components;

    if (rowValues?.source === 'secret') {
        return (
            <DynamicDropdown
                fluid
                selection
                value={value}
                fetchUrl="/secrets"
                onChange={newValue => onChange(undefined, { name, value: newValue as string })}
                clearable={false}
                toolbox={widgetlessToolbox}
                valueProp="key"
            />
        );
    }

    return <Form.Input value={value} onChange={(event, data) => onChange(event, { name, value: data.value })} fluid />;
}
