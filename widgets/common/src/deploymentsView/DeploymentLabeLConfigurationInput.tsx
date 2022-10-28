import type { FunctionComponent } from 'react';
import React from 'react';
import KeyDropdown from '../labels/KeyDropdown';

const DeploymentLabelConfigurationInput: FunctionComponent<Stage.Types.CustomConfigurationComponentProps<string[]>> = ({
    value,
    onChange,
    name,
    widgetlessToolbox
}) => {
    return (
        <KeyDropdown
            onChange={(newValue: string[]) => {
                onChange(undefined, { name, value: newValue });
            }}
            value={value}
            toolbox={widgetlessToolbox}
            multiple
            allowAdditions
            overrideResourceType="deployments"
        />
    );
};

export default DeploymentLabelConfigurationInput;
