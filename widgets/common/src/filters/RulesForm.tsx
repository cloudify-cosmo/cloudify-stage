import { useEffect, useState } from 'react';
import type { FunctionComponent } from 'react';

import RuleRow from './RuleRow';
import AddRuleButton from './AddRuleButton';
import type { FilterRule, FilterRuleRow, FilterRuleRowErrors } from './types';
import { FilterRuleType, FilterRuleOperators, FilterRuleRowType } from './types';
import { isAnyOperator } from './common';

function getNewRow(): FilterRuleRow {
    const { uuid } = Stage.Utils;

    return {
        id: uuid(),
        rule: {
            type: FilterRuleType.Attribute,
            key: FilterRuleRowType.Blueprint,
            operator: FilterRuleOperators.Contains,
            values: []
        }
    };
}

function getFilterRuleRows(filterRules: FilterRule[]): FilterRuleRow[] {
    const { uuid } = Stage.Utils;

    return filterRules.length > 0 ? filterRules.map(rule => ({ id: uuid(), rule })) : [getNewRow()];
}

function getFilterRule(filterRuleRow: FilterRuleRow): FilterRule {
    return filterRuleRow.rule;
}

interface RulesFormProps {
    initialFilters: FilterRule[];
    onChange: (filterRules: FilterRule[]) => void;
    onErrors: (errors: FilterRuleRowErrors) => void;
    toolbox: Stage.Types.Toolbox;
}

const RulesForm: FunctionComponent<RulesFormProps> = ({ initialFilters, onChange, onErrors, toolbox }) => {
    const [rows, setRows] = useState(() => getFilterRuleRows(initialFilters));

    function validateRows() {
        const errors: FilterRuleRowErrors = {};

        rows.forEach((row: FilterRuleRow, index: number) => {
            const { type, key, operator, values } = row.rule;
            const ruleHasNoValuesSet = values.length === 0;
            const rowNumber = index + 1;

            if (type === FilterRuleType.Label) {
                if (!key) {
                    errors[`row${rowNumber}LabelKey`] = `Please provide label key in row ${rowNumber}`;
                }
                if (isAnyOperator(operator) && ruleHasNoValuesSet) {
                    errors[`row${rowNumber}LabelValue`] = `Please provide label values in row ${rowNumber}`;
                }
            } else if (ruleHasNoValuesSet) {
                errors[`row${rowNumber}Value`] = `Please provide values in row ${rowNumber}`;
            }
        });

        onErrors(errors);
    }

    function addRule() {
        setRows(latestRows => [...latestRows, getNewRow()]);
    }

    function removeRule(id: string) {
        setRows(latestRows => latestRows.filter(row => row.id !== id));
    }

    function updateRule(id: string, newRule: FilterRule) {
        setRows(latestRows => latestRows.map(row => (row.id === id ? { id: row.id, rule: newRule } : row)));
    }

    useEffect(() => {
        onChange(rows.map(getFilterRule));
        validateRows();
    }, [rows]);

    return (
        <>
            {rows.map(row => (
                <RuleRow
                    key={row.id}
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
