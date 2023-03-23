import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'cloudify-ui-components';
import type { DropdownProps } from 'semantic-ui-react';
import { useBoolean } from '../../../../utils/hooks';
import { useFetchTrigger } from './EnvironmentDropdown.utils';
import SearchActions from '../../actions/SearchActions';
import type { FetchedBlueprint, FilteredEnvironments } from './EnvironmentDropdown.types';
import EnvironmentDropdownItemList from './EnvironmentDropdownItemList';
import type { EnvironmentDropdownItemListProps } from './EnvironmentDropdownItemList';
import { defaultEnvironmentList } from './EnvironmentDropdown.consts';
import type { FilterRule } from '../../filters/types';

interface SuggestedBlueprintDropdownProps {
    value: string;
    name: DropdownProps['name'];
    onChange: (environmentId: string) => void;
    toolbox: Stage.Types.Toolbox;
    filterRules: FilterRule[];
}

const SuggestedBlueprintDropdown = ({
    value,
    name,
    onChange,
    toolbox,
    filterRules
}: SuggestedBlueprintDropdownProps) => {
    const searchActions = new SearchActions(toolbox);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [shouldFetchEnvironments, triggerEnvironmentsFetching, blockEnvironmentsFetching] = useBoolean();
    const [environmentList, setEnvironmentList] = useState<FilteredEnvironments>(defaultEnvironmentList);
    const [selectedEnvironment, setSelectedEnvironment] = useState<FetchedBlueprint | undefined>();
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
            .doListBlueprints<keyof FetchedBlueprint>(filterRules, {
                _search: searchQuery,
                _include: 'id,requirements'
            })
            .then(data => {
                const filteredBlueprints = {
                    suggestedEnvironments: data.items,
                    notSuggestedEnvironments: []
                };
                // const filteredEnvironments = filterEnvironments(mappedEnvironments, filterRules);
                setEnvironmentList(filteredBlueprints);
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
                text={selectedEnvironment?.id}
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
                        environments={environmentList.notSuggestedEnvironments}
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

export default SuggestedBlueprintDropdown;
