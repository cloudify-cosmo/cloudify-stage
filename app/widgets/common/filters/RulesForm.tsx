import type { FunctionComponent } from 'react';
import React, { useEffect, useState } from 'react';

import RuleRow from './RuleRow';
import AddRuleButton from './AddRuleButton';
import type { FilterResourceType, FilterRule, FilterRuleRow } from './types';
import { FilterRuleOperators, FilterRuleRowType, FilterRuleType } from './types';
import { isMultipleValuesOperator } from './common';
import ResourceTypeContext from './resourceTypeContext';
import StageUtils from '../../../utils/stageUtils';

function hasError({ type, key, operator, values }: FilterRule) {
    const noValuesDefined = !values?.length;

    if (type === FilterRuleType.Label) {
        const noKeyDefined = !key;
        return noKeyDefined || (isMultipleValuesOperator(operator) && noValuesDefined);
    }

    return noValuesDefined;
}

function getNewRow(defaultType?: FilterRuleType): FilterRuleRow {
    const { uuid } = StageUtils;
    const emptyRule: FilterRule = {
        type: defaultType || FilterRuleType.Attribute,
        key: defaultType === FilterRuleType.Label ? '' : FilterRuleRowType.Blueprint,
        operator: FilterRuleOperators.Contains,
        values: []
    };

    return {
        id: uuid(),
        rule: emptyRule,
        hasError: hasError(emptyRule)
    };
}

function getFilterRuleRows(filterRules: FilterRule[], minCount: number, defaultType?: FilterRuleType): FilterRuleRow[] {
    const { uuid } = StageUtils;

    return filterRules.length >= minCount
        ? filterRules.map(rule => ({ id: uuid(), rule, hasError: hasError(rule) }))
        : [getNewRow(defaultType)];
}

function getFilterRule(filterRuleRow: FilterRuleRow): FilterRule {
    return filterRuleRow.rule;
}

export interface RulesFormProps {
    defaultType?: FilterRuleType;
    hideType?: boolean;
    initialFilters: FilterRule[];
    onChange: (filterRules: FilterRule[], hasErrors: boolean) => void;
    markErrors: boolean;
    toolbox: Stage.Types.WidgetlessToolbox;
    resourceType: FilterResourceType;
    minLength?: number;
}

const RulesForm: FunctionComponent<RulesFormProps> = ({
    defaultType,
    hideType,
    initialFilters,
    onChange,
    markErrors,
    toolbox,
    resourceType,
    minLength = 0
}) => {
    const [rows, setRows] = useState(() => getFilterRuleRows(initialFilters, minLength, defaultType));

    function handleChange(newRows: FilterRuleRow[]) {
        onChange(newRows.map(getFilterRule), newRows.filter(row => row.hasError).length > 0);
    }

    function addRule() {
        const newRows = [...rows, getNewRow(defaultType)];
        setRows(newRows);
        handleChange(newRows);
    }

    function removeRule(id: string) {
        const newRows = rows.filter(row => row.id !== id);
        setRows(newRows);
        handleChange(newRows);
    }

    function updateRule(id: string, newRule: FilterRule) {
        const newRows = rows.map(row =>
            row.id === id ? { id: row.id, rule: newRule, hasError: hasError(newRule) } : row
        );
        setRows(newRows);
        handleChange(newRows);
    }

    useEffect(() => {
        setRows(getFilterRuleRows(initialFilters, minLength, defaultType));
    }, [initialFilters, defaultType, minLength]);

    return (
        <ResourceTypeContext.Provider value={resourceType}>
            {rows.map(row => (
                <RuleRow
                    key={row.id}
                    error={markErrors && row.hasError}
                    hideType={hideType}
                    rule={getFilterRule(row)}
                    removable={rows.length > minLength}
                    onChange={rule => updateRule(row.id, rule)}
                    onRemove={() => removeRule(row.id)}
                    toolbox={toolbox}
                />
            ))}
            <AddRuleButton onClick={addRule} />
        </ResourceTypeContext.Provider>
    );
};
export default RulesForm;
