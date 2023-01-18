import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Form } from 'cloudify-ui-components';
import type { DropdownItemProps, DropdownProps } from 'semantic-ui-react';
import type { DynamicDropdownProps } from '../../components/DynamicDropdown';
import { useBoolean } from '../../../../utils/hooks';
import { formatDropdownItemText, simplifyCapabilities, isDeploymentSuggested } from './EnvironmentDropdown.utils';
import SearchActions from '../../actions/SearchActions';
import { FilterRuleOperators, FilterRuleType } from '../../filters/types';
import type { BlueprintRequirements } from '../../blueprints/BlueprintActions';
import type { FetchedDeployment } from './EnvironmentDropdown.types';
import EnvironmentDropdownList from './EnvironmentDropdownList';

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
    const [fetchedDeployments, setFetchedDeployments] = useState<FetchedDeployment[]>([]);

    useEffect(() => {
        // eslint-disable-next-line
    }, []);

    const handleSearchChange: DropdownProps['onSearchChange'] = (_event, data) => {
        setSearchQuery(data.searchQuery);
    };

    const resetSearch = () => {
        setSearchQuery('');
    };

    // TODO Norbert: This function seems to be rendered to many times, see if it can be optimized
    const getDropdownOptions = (suggested?: boolean): FetchedDeployment[] => {
        const capabilities = simplifyCapabilities(capabilitiesToMatch);
        const { suggestedDeployments, otherDeployments } = fetchedDeployments.reduce<{
            suggestedDeployments: FetchedDeployment[];
            otherDeployments: FetchedDeployment[];
        }>(
            (aggregator, deployment) => {
                const isSuggestedOption = isDeploymentSuggested(deployment, capabilities);

                if (isSuggestedOption) {
                    aggregator.suggestedDeployments.push(deployment);
                } else {
                    aggregator.otherDeployments.push(deployment);
                }

                return aggregator;
            },
            {
                suggestedDeployments: [],
                otherDeployments: []
            }
        );

        return suggested ? suggestedDeployments : otherDeployments;
    };

    const handleChange: DropdownProps['onChange'] = (_event, data) => {
        const changeValue = !isEmpty(data?.value) ? (data.value as string) : null;
        onChange(changeValue);
    };

    const loadData = () => {
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
                setFetchedDeployments(data.items);
            })
            .finally(unsetLoading);
    };

    const handleDropdownItemClick: DropdownItemProps['onClick'] = (_event, { value: dropdownItemValue }) => {
        onChange(dropdownItemValue as OnChangeValue);
    };

    useEffect(() => {
        loadData();
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
                <EnvironmentDropdownList
                    dropdownValue={value}
                    onItemClick={handleDropdownItemClick}
                    isSuggestedList
                    environments={getDropdownOptions(true)}
                />
                <EnvironmentDropdownList
                    dropdownValue={value}
                    onItemClick={handleDropdownItemClick}
                    environments={getDropdownOptions()}
                />
            </Form.Dropdown.Menu>
        </Form.Dropdown>
    );
};

export default EnvironmentDropdown;
