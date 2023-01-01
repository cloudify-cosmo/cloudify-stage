import type { FunctionComponent } from 'react';
import React from 'react';
import DynamicDropdown from '../components/DynamicDropdown';

const FilterIdDropdown: FunctionComponent<Stage.Types.CustomConfigurationComponentProps<string | null>> = ({
    name,
    value,
    onChange,
    widgetlessToolbox
}) => (
    <DynamicDropdown
        toolbox={widgetlessToolbox}
        onChange={newValue => onChange(undefined, { name, value: newValue as string })}
        fetchUrl="/filters/deployments?_include=id"
        prefetch
        value={value}
    />
);
export default FilterIdDropdown;
