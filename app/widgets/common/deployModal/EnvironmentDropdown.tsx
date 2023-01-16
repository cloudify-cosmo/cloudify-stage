import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Form } from 'cloudify-ui-components';
import type { DropdownItemProps, DropdownProps } from 'semantic-ui-react';
import type { DynamicDropdownProps } from '../components/DynamicDropdown';
import type { ListDeploymentsParams } from '../actions/SearchActions';
import { useBoolean } from '../../../utils/hooks';
import { mapFetchedOptions } from './EnvironmentDropdown.utils';
import DynamicDropdown from '../components/DynamicDropdown';

const deploymentSearchParams: (keyof ListDeploymentsParams)[] = ['_search', '_search_name'];
const fetchUrl = '/deployments';

// TODO Norbert: Consider extending interface with the `DynamicDropdownProps`, so that the user could pass not required by the functionality props, like `prefetch`, `clearable` etc
interface EnvironmentDropdownProps {
    value: DropdownProps['value'];
    name: DynamicDropdownProps['name'];
    placeholder: DynamicDropdownProps['placeholder'];
    onChange: (value: string | null) => void;
    toolbox: Stage.Types.Toolbox;
}

export interface FetchedOption {
    id: string;
    // eslint-disable-next-line
    display_name: string;
}

// TODO:
// - Fetching Data (remember about a prefetch 😁)
// - Displaying Data via MenuItems
// - Sorting data
// - Displaying data with certain headers
// - Add pagination for fetched data

const EnvironmentDropdown = ({ value = '', name, placeholder, onChange, toolbox }: EnvironmentDropdownProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [fetchedOptions, setFetchedOptions] = useState<FetchedOption[]>([]);

    const handleSearchChange: DropdownProps['onSearchChange'] = (_event, data) => {
        setSearchQuery(data.searchQuery);
    };

    const resetSearch = () => {
        setSearchQuery('');
    };

    const getOptions = () => {
        return mapFetchedOptions(fetchedOptions);
    };

    const handleChange: DropdownProps['onChange'] = (_event, data) => {
        const changeValue = !isEmpty(data?.value) ? (data.value as string) : null;
        onChange(changeValue);
    };

    const loadData = () => {
        setLoading();

        // TODO: Fetch only deployments marked as `environment`
        toolbox
            .getManager()
            .doGetFull<FetchedOption>(fetchUrl, {
                _include: 'id,display_name',
                _search: searchQuery,
                _search_name: searchQuery
            })
            .then(data => {
                setFetchedOptions(data.items);
            })
            .finally(unsetLoading);
    };

    useEffect(() => {
        loadData();
    }, [searchQuery]);

    return (
        <Form.Dropdown
            name={name}
            fluid
            loading={isLoading}
            value={value}
            placeholder={placeholder}
            clearable={false}
            search
            selection
            selectOnBlur={false}
            options={getOptions()}
            onSearchChange={handleSearchChange}
            onBlur={resetSearch}
            onChange={handleChange}
        />
        // <DynamicDropdown
        //     value={value as any}
        //     name={name}
        //     placeholder={placeholder}
        //     clearable={false}
        //     fetchUrl="/deployments?_include=id,display_name"
        //     searchParams={deploymentSearchParams}
        //     onChange={onChange as any}
        //     toolbox={toolbox}
        //     prefetch
        // />
    );
};

export default EnvironmentDropdown;
