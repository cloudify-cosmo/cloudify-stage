import type { FunctionComponent } from 'react';
import React from 'react';
import ResourceTypeContext from '../filters/resourceTypeContext';
import KeyDropdown from '../labels/KeyDropdown';

const DeploymentLabelConfigurationInput: FunctionComponent<Stage.Types.CustomConfigurationComponentProps<string[]>> = ({
    value,
    onChange,
    name,
    widgetlessToolbox
}) => {
    return (
        <ResourceTypeContext.Provider value="deployments">
            <KeyDropdown
                onChange={(newValue: string[]) => {
                    onChange(undefined, { name, value: newValue || [] });
                }}
                value={value}
                toolbox={widgetlessToolbox}
                multiple
                allowAdditions
            />
        </ResourceTypeContext.Provider>
    );
};

export default DeploymentLabelConfigurationInput;
