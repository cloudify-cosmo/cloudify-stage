import React from 'react';
import DynamicDropdown from '../components/DynamicDropdown';
import type { DynamicDropdownProps } from '../components/DynamicDropdown';
import type { ListDeploymentsParams } from '../actions/SearchActions';
import { deployOnTextFormatter } from './EnvironmentDropdown.utils';

const deploymentSearchParams: (keyof ListDeploymentsParams)[] = ['_search', '_search_name'];

// TODO Norbert: Consider extending interface with the `DynamicDropdownProps`, so that the user could pass not required by the functionality props, like `prefetch`, `clearable` etc
interface EnvironmentDropdownProps {
    value: DynamicDropdownProps['value'];
    name: DynamicDropdownProps['name'];
    placeholder: DynamicDropdownProps['placeholder'];
    onChange: DynamicDropdownProps['onChange'];
    toolbox: Stage.Types.Toolbox;
}

const EnvironmentDropdown = ({ value, name, placeholder, onChange, toolbox }: EnvironmentDropdownProps) => {
    return (
        <DynamicDropdown
            value={value}
            name={name}
            fetchUrl="/deployments?_include=id,display_name"
            placeholder={placeholder}
            searchParams={deploymentSearchParams}
            clearable={false}
            onChange={onChange}
            textFormatter={deployOnTextFormatter}
            toolbox={toolbox}
            prefetch
        />
    );
};

export default EnvironmentDropdown;
