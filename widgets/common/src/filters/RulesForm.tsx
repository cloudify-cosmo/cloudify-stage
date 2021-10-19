import { useEffect, useState } from 'react';
import type { FunctionComponent } from 'react';

import RuleRow from './RuleRow';
import AddRuleButton from './AddRuleButton';
import type { FilterRule, FilterRuleRow } from './types';
import { FilterRuleType, FilterRuleOperators } from './types';
import { isMultipleValuesOperator } from './common';

function hasError({ type, key, operator, values }: FilterRule) {
    const noValuesDefined = !values?.length;

    if (type === FilterRuleType.Label) {
        const noKeyDefined = !key;
        return noKeyDefined || (isMultipleValuesOperator(operator) && noValuesDefined);
    }

    return noValuesDefined;
}

function getNewRow(defaultType?: FilterRuleType): FilterRuleRow {
    const { uuid } = Stage.Utils;
    const emptyRule: FilterRule = {
        type: defaultType || FilterRuleType.Attribute,
        key: '',
        operator: FilterRuleOperators.Contains,
        values: []
    };

    return {
        id: uuid(),
        rule: emptyRule,
        hasError: hasError(emptyRule)
    };
}

function getFilterRuleRows(filterRules: FilterRule[], defaultType?: FilterRuleType): FilterRuleRow[] {
    const { uuid } = Stage.Utils;

    return filterRules.length > 0
        ? filterRules.map(rule => ({ id: uuid(), rule, hasError: hasError(rule) }))
        : [getNewRow(defaultType)];
}

function getFilterRule(filterRuleRow: FilterRuleRow): FilterRule {
    return filterRuleRow.rule;
}

export interface RulesFormProps {
    defaultType?: FilterRuleType;
    initialFilters: FilterRule[];
    onChange: (filterRules: FilterRule[], hasErrors: boolean) => void;
    markErrors: boolean;
    toolbox: Stage.Types.Toolbox | Stage.Types.WidgetlessToolbox;
    collectionName: string;
    minLength?: number;
}

const RulesForm: FunctionComponent<RulesFormProps> = ({
    defaultType,
    initialFilters,
    onChange,
    markErrors,
    toolbox,
    collectionName,
    minLength = 0
}) => {
    const [rows, setRows] = useState(() => getFilterRuleRows(initialFilters, defaultType));

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
        setRows(getFilterRuleRows(initialFilters, defaultType));
    }, [initialFilters, defaultType]);

    return (
        <>
            {rows.map(row => (
                <RuleRow
                    key={row.id}
                    error={markErrors && row.hasError}
                    rule={getFilterRule(row)}
                    removable={rows.length > minLength}
                    onChange={rule => updateRule(row.id, rule)}
                    onRemove={() => removeRule(row.id)}
                    toolbox={toolbox}
                    collectionName={collectionName}
                />
            ))}
            <AddRuleButton onClick={addRule} />
        </>
    );
};
export default RulesForm;
