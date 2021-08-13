import { FunctionComponent } from 'react';

const FilterIdDropdown: FunctionComponent<Stage.Types.CustomConfigurationComponentProps<string | null>> = ({
    name,
    value,
    onChange,
    widgetlessToolbox
}) => (
    <Stage.Common.DynamicDropdown
        toolbox={widgetlessToolbox}
        onChange={newValue => onChange(null, { name, value: newValue as string })}
        fetchUrl="/filters/deployments?_include=id"
        prefetch
        value={value}
    />
);
export default FilterIdDropdown;
