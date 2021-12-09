import React from 'react';
import { CustomConfigurationComponentProps } from '../../../app/utils/StageAPI';

interface TerraformVariableValueInputProps extends CustomConfigurationComponentProps<string> {
    rowValues?: { source: string };
}

export default function TerraformVariableValueInput({
    rowValues,
    name,
    value,
    onChange,
    widgetlessToolbox
}: TerraformVariableValueInputProps) {
    const { Input } = Stage.Basic;
    const { DynamicDropdown } = Stage.Common;

    return rowValues?.source === 'secret' ? (
        <DynamicDropdown
            fluid={false}
            selection
            value={value}
            fetchUrl="/secrets"
            onChange={newValue => onChange(null, { name, value: newValue as string })}
            clearable={false}
            toolbox={widgetlessToolbox}
            valueProp="key"
        />
    ) : (
        <Input value={value === null ? '' : value} onChange={(event, data) => onChange(event, { name, ...data })} />
    );
}
