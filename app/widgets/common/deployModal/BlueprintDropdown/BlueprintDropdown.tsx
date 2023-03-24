import React from 'react';
import SuggestedBlueprintDropdown from './SuggestedBlueprintDropdown';
import DynamicDropdown from '../../components/DynamicDropdown';
import type { FilterRule } from '../../filters/types';
import type { DropdownValue } from '../../types';
import type { SuggestedBlueprintDropdownProps } from './SuggestedBlueprintDropdown';

interface BlueprintDropdownProps extends Pick<SuggestedBlueprintDropdownProps, 'environmentCapabilities'> {
    showSuggestions?: boolean;
    name: string;
    value: string;
    onChange: (blueprintId: DropdownValue) => void;
    toolbox: Stage.Types.Toolbox;
    filterRules?: FilterRule[];
}

const BlueprintDropdown = ({
    name,
    value,
    onChange,
    toolbox,
    filterRules = [],
    environmentCapabilities,
    showSuggestions
}: BlueprintDropdownProps) => {
    return showSuggestions ? (
        <SuggestedBlueprintDropdown
            name={name}
            value={value}
            toolbox={toolbox}
            filterRules={filterRules}
            onChange={onChange}
            environmentCapabilities={environmentCapabilities}
        />
    ) : (
        <DynamicDropdown
            name={name}
            value={value}
            fetchUrl="/searches/blueprints?_include=id&state=uploaded"
            clearable={false}
            onChange={onChange}
            toolbox={toolbox}
            filterRules={filterRules}
            prefetch
        />
    );
};

export default BlueprintDropdown;
