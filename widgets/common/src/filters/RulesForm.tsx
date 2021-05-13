import { useEffect, useState } from 'react';
import type { FunctionComponent } from 'react';

import RuleRow from './RuleRow';
import AddRuleButton from './AddRuleButton';
import type { FilterRule, FilterRuleRow } from './types';
import { FilterRuleType, FilterRuleOperators, FilterRuleRowType } from './types';
import { isMultipleValuesOperator } from './common';

function hasError({ type, key, operator, values }: FilterRule) {
    const noValuesDefined = !values?.length;

    if (type === FilterRuleType.Label) {
        const noKeyDefined = !key;
        return noKeyDefined || (isMultipleValuesOperator(operator) && noValuesDefined);
    }

    return noValuesDefined;
}

function getNewRow(): FilterRuleRow {
    const { uuid } = Stage.Utils;
    const emptyRule: FilterRule = {
        type: FilterRuleType.Attribute,
        key: FilterRuleRowType.Blueprint,
        operator: FilterRuleOperators.Contains,
        values: []
    };

    return {
        id: uuid(),
        rule: emptyRule,
        hasError: hasError(emptyRule)
    };
}

function getFilterRuleRows(filterRules: FilterRule[]): FilterRuleRow[] {
    const { uuid } = Stage.Utils;

    return filterRules.length > 0
        ? filterRules.map(rule => ({ id: uuid(), rule, hasError: hasError(rule) }))
        : [getNewRow()];
}

function getFilterRule(filterRuleRow: FilterRuleRow): FilterRule {
    return filterRuleRow.rule;
}

interface RulesFormProps {
    initialFilters: FilterRule[];
    onChange: (filterRules: FilterRule[], hasErrors: boolean) => void;
    markErrors: boolean;
    toolbox: Stage.Types.Toolbox;
}

const RulesForm: FunctionComponent<RulesFormProps> = ({ initialFilters, onChange, markErrors, toolbox }) => {
    const [rows, setRows] = useState(() => getFilterRuleRows(initialFilters));

    function addRule() {
        setRows(latestRows => [...latestRows, getNewRow()]);
    }

    function removeRule(id: string) {
        setRows(latestRows => latestRows.filter(row => row.id !== id));
    }

    function updateRule(id: string, newRule: FilterRule) {
        setRows(latestRows =>
            latestRows.map(row => (row.id === id ? { id: row.id, rule: newRule, hasError: hasError(newRule) } : row))
        );
    }

    useEffect(() => {
        onChange(rows.map(getFilterRule), rows.filter(row => row.hasError).length > 0);
    }, [rows]);

    return (
        <>
            {rows.map(row => (
                <RuleRow
                    key={row.id}
                    error={markErrors && row.hasError}
                    rule={getFilterRule(row)}
                    removable={rows.length > 1}
                    onChange={rule => updateRule(row.id, rule)}
                    onRemove={() => removeRule(row.id)}
                    toolbox={toolbox}
                />
            ))}
            <AddRuleButton onClick={addRule} />
        </>
    );
};
export default RulesForm;
