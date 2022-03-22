import { FunctionComponent } from 'react';
import DynamicDropdown from '../components/DynamicDropdown';

const FilterIdDropdown: FunctionComponent<Stage.Types.CustomConfigurationComponentProps<string | null>> = ({
    name,
    value,
    onChange,
    widgetlessToolbox
}) => (
    <DynamicDropdown
        toolbox={widgetlessToolbox}
        onChange={newValue => onChange(null, { name, value: newValue as string })}
        fetchUrl="/filters/deployments?_include=id"
        prefetch
        value={value}
    />
);
export default FilterIdDropdown;
