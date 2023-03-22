import React from 'react';
import SuggestedBlueprintsDropdown from './SuggestedBlueprintsDropdown';
import DynamicDropdown from '../../components/DynamicDropdown';
import type { FilterRule } from '../../filters/types';
import type { DropdownValue } from '../../types';

interface BlueprintDropdownProps {
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
    filterRules,
    showSuggestions
}: BlueprintDropdownProps) => {
    return showSuggestions ? (
        <SuggestedBlueprintsDropdown name={name} value={value} toolbox={toolbox} onChange={onChange} />
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
