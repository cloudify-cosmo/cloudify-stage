import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Form } from 'cloudify-ui-components';
import type { DropdownItemProps, DropdownProps } from 'semantic-ui-react';
import type { DynamicDropdownProps } from '../../components/DynamicDropdown';
import { useBoolean } from '../../../../utils/hooks';
import { filterEnvironments } from './EnvironmentDropdown.utils';
import SearchActions from '../../actions/SearchActions';
import { FilterRuleOperators, FilterRuleType } from '../../filters/types';
import type { BlueprintRequirements } from '../../blueprints/BlueprintActions';
import type { FilteredEnvironments } from './EnvironmentDropdown.types';
import EnvironmentDropdownList from './EnvironmentDropdownList';
import { defaultEnvironmentList } from './EnvironmentDropdown.consts';

type OnChangeValue = string | null;

// TODO Norbert: Consider extending interface with the `DynamicDropdownProps`, so that the user could pass not required by the functionality props, like `prefetch`, `clearable` etc
interface EnvironmentDropdownProps {
    value: DropdownProps['value'];
    name: DynamicDropdownProps['name'];
    placeholder: DynamicDropdownProps['placeholder'];
    onChange: (value: OnChangeValue) => void;
    toolbox: Stage.Types.Toolbox;
    capabilitiesToMatch?: BlueprintRequirements['parent_capabilities'];
}

// TODO:
// - Handling empty lists state
// - Handling lists loading state
// - Styling MenuItems
// - Error handling

const EnvironmentDropdown = ({
    value = '',
    name,
    placeholder,
    onChange,
    toolbox,
    capabilitiesToMatch = []
}: EnvironmentDropdownProps) => {
    const searchActions = new SearchActions(toolbox);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [environmentList, setEnvironmentList] = useState<FilteredEnvironments>(defaultEnvironmentList);

    const handleSearchChange: DropdownProps['onSearchChange'] = (_event, data) => {
        setSearchQuery(data.searchQuery);
    };

    const resetSearch = () => {
        setSearchQuery('');
    };

    const handleChange: DropdownProps['onChange'] = (_event, data) => {
        const changeValue = !isEmpty(data?.value) ? (data.value as string) : null;
        onChange(changeValue);
    };

    const fetchEnvironments = () => {
        setLoading();

        searchActions
            .doListAllDeployments(
                [
                    {
                        key: 'csys-obj-type',
                        values: ['environment'],
                        type: FilterRuleType.Label,
                        operator: FilterRuleOperators.AnyOf
                    }
                ],
                {
                    _include: 'id,display_name,capabilities',
                    _search: searchQuery
                }
            )
            .then(data => {
                const filteredEnvironments = filterEnvironments(data.items, capabilitiesToMatch);
                setEnvironmentList(filteredEnvironments);
            })
            .finally(unsetLoading);
    };

    const handleDropdownItemClick: DropdownItemProps['onClick'] = (_event, { value: dropdownItemValue }) => {
        onChange(dropdownItemValue as OnChangeValue);
    };

    useEffect(() => {
        fetchEnvironments();
    }, [searchQuery]);

    return (
        // TODO Norbert: Implement debounce functionality
        // TODO Norbert: Persist selected value data on dropdown blur
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
            onSearchChange={handleSearchChange}
            onBlur={resetSearch}
            onChange={handleChange}
        >
            <Form.Dropdown.Menu>
                {/* NOTE Norbert: List items are duplicated while reopening deploy modal */}
                <EnvironmentDropdownList
                    environments={environmentList.suggestedEnvironments}
                    onItemClick={handleDropdownItemClick}
                    activeEnvironmentId={value}
                    isSuggestedList
                />
                <EnvironmentDropdownList
                    environments={environmentList.nonSuggestedEnvironments}
                    onItemClick={handleDropdownItemClick}
                    activeEnvironmentId={value}
                />
            </Form.Dropdown.Menu>
        </Form.Dropdown>
    );
};

export default EnvironmentDropdown;
