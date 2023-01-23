import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'cloudify-ui-components';
import type { DropdownProps } from 'semantic-ui-react';
import { useBoolean } from '../../../../utils/hooks';
import { filterEnvironments, mapFetchedEnvironments, useFetchTrigger } from './EnvironmentDropdown.utils';
import SearchActions from '../../actions/SearchActions';
import type { BlueprintRequirements } from '../../blueprints/BlueprintActions';
import type { Environment, FilteredEnvironments } from './EnvironmentDropdown.types';
import EnvironmentDropdownItemList from './EnvironmentDropdownItemList';
import type { EnvironmentDropdownItemListProps } from './EnvironmentDropdownItemList';
import { defaultEnvironmentList } from './EnvironmentDropdown.consts';
import { deploymentTypeFilterRule } from '../../deploymentsView/detailsPane/drilldownButtons/SubdeploymentDrilldownButton.consts';

interface EnvironmentDropdownProps {
    value?: string;
    name: DropdownProps['name'];
    placeholder: DropdownProps['placeholder'];
    onChange: (environmentId: string) => void;
    toolbox: Stage.Types.Toolbox;
    capabilitiesToMatch?: BlueprintRequirements['parent_capabilities'];
}

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
    const [shouldFetchEnvironments, triggerEnvironmentsFetching, blockEnvironmentsFetching] = useBoolean();
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

    const fetchEnvironments = () => {
        setLoading();

        searchActions
            .doListAllDeployments([deploymentTypeFilterRule.environments], {
                _include: 'id,display_name,capabilities',
                _search: searchQuery
            })
            .then(data => {
                const mappedEnvironments = mapFetchedEnvironments(data.items);
                const filteredEnvironments = filterEnvironments(mappedEnvironments, capabilitiesToMatch);
                setEnvironmentList(filteredEnvironments);
            })
            .finally(() => {
                blockEnvironmentsFetching();
                unsetLoading();
            });
    };

    const handleDropdownItemClick: EnvironmentDropdownItemListProps['onItemClick'] = environment => {
        setSelectedEnvironment(environment);
        onChange(environment.id);
        forceDropdownBlur();
    };

    useEffect(() => {
        if (shouldFetchEnvironments) {
            fetchEnvironments();
        }
    }, [shouldFetchEnvironments]);

    useFetchTrigger(() => {
        triggerEnvironmentsFetching();
    }, [searchQuery]);

    return (
        <>
            <Dropdown
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
                <Dropdown.Menu>
                    <EnvironmentDropdownItemList
                        environments={environmentList.suggestedEnvironments}
                        onItemClick={handleDropdownItemClick}
                        activeEnvironmentId={value}
                        isSuggestedList
                        loading={isLoading}
                    />
                    <EnvironmentDropdownItemList
                        environments={environmentList.nonSuggestedEnvironments}
                        onItemClick={handleDropdownItemClick}
                        activeEnvironmentId={value}
                        loading={isLoading}
                    />
                </Dropdown.Menu>
            </Dropdown>
            {/* NOTE: Purpose of this element is to have a way of forcing dropdown blur when necessery */}
            <span ref={blurForcingElementRef} />
        </>
    );
};

export default EnvironmentDropdown;
