import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { Form } from 'cloudify-ui-components';
import type { DropdownProps } from 'semantic-ui-react';
import type { DynamicDropdownProps } from '../../components/DynamicDropdown';
import { useBoolean } from '../../../../utils/hooks';
import { filterEnvironments, mapFetchedEnvironments } from './EnvironmentDropdown.utils';
import SearchActions from '../../actions/SearchActions';
import { FilterRuleOperators, FilterRuleType } from '../../filters/types';
import type { BlueprintRequirements } from '../../blueprints/BlueprintActions';
import type { Environment, FilteredEnvironments } from './EnvironmentDropdown.types';
import EnvironmentDropdownList from './EnvironmentDropdownList';
import type { EnvironmentDropdownListProps } from './EnvironmentDropdownList';
import { defaultEnvironmentList } from './EnvironmentDropdown.consts';

interface EnvironmentDropdownProps {
    value?: string;
    name: DynamicDropdownProps['name'];
    placeholder: DynamicDropdownProps['placeholder'];
    onChange: (environmentId: string) => void;
    toolbox: Stage.Types.Toolbox;
    capabilitiesToMatch?: BlueprintRequirements['parent_capabilities'];
}

// TODO:
// - Write some tests

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
    const [selectedEnvironment, setSelectedEnvironment] = useState<Environment | undefined>();
    const blurForcingElementRef = useRef<HTMLSpanElement>(null);

    const handleSearchChange: DropdownProps['onSearchChange'] = (_event, data) => {
        setSearchQuery(data.searchQuery);
    };

    const resetSearch = () => {
        setSearchQuery('');
    };

    const forceDropdownBlur = () => {
        blurForcingElementRef.current?.click();
    };

    const fetchEnvironments = debounce(() => {
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
                const mappedEnvironments = mapFetchedEnvironments(data.items);
                const filteredEnvironments = filterEnvironments(mappedEnvironments, capabilitiesToMatch);
                setEnvironmentList(filteredEnvironments);
            })
            .finally(unsetLoading);
    }, 500);

    const handleDropdownItemClick: EnvironmentDropdownListProps['onItemClick'] = environment => {
        setSelectedEnvironment(environment);
        onChange(environment.id);
        forceDropdownBlur();
    };

    useEffect(() => {
        fetchEnvironments();
    }, [searchQuery]);

    return (
        <>
            <Form.Dropdown
                name={name}
                fluid
                loading={isLoading}
                value={value}
                text={selectedEnvironment?.displayName}
                placeholder={placeholder}
                search
                selection
                selectOnBlur={false}
                onSearchChange={handleSearchChange}
                onBlur={resetSearch}
            >
                <Form.Dropdown.Menu>
                    <EnvironmentDropdownList
                        environments={environmentList.suggestedEnvironments}
                        onItemClick={handleDropdownItemClick}
                        activeEnvironmentId={value}
                        isSuggestedList
                        loading={isLoading}
                    />
                    <EnvironmentDropdownList
                        environments={environmentList.nonSuggestedEnvironments}
                        onItemClick={handleDropdownItemClick}
                        activeEnvironmentId={value}
                        loading={isLoading}
                    />
                </Form.Dropdown.Menu>
            </Form.Dropdown>
            {/* NOTE: Purpose of this element is to have a way of forcing dropdown blur when necessery */}
            <span ref={blurForcingElementRef} />
        </>
    );
};

export default EnvironmentDropdown;
