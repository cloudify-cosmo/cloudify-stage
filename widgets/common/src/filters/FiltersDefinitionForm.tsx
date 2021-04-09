import { useState } from 'react';
import type { FunctionComponent } from 'react';

import RuleRow from './RuleRow';
import AddRuleButton from './AddRuleButton';
import type { FilterRule, FilterRuleRow } from './types';
import { FilterRuleType, FilterRuleOperators, FilterRuleRowType } from './types';

function getNewRow(): FilterRuleRow {
    const { uuid } = Stage.Utils;

    return {
        id: uuid(),
        rule: {
            type: FilterRuleType.Attribute,
            key: FilterRuleRowType.Blueprint,
            operator: FilterRuleOperators.Contain,
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

interface FiltersDefinitionFormProps {
    initialFilters: FilterRule[];
    onChange: (filterRules: FilterRule[]) => void;
    toolbox: Stage.Types.Toolbox;
}

const FiltersDefinitionForm: FunctionComponent<FiltersDefinitionFormProps> = ({
    initialFilters,
    onChange,
    toolbox
}) => {
    const {
        Basic: { UnsafelyTypedForm: Form },
        Hooks: { useUpdateEffect }
    } = Stage;
    const [rows, setRows] = useState(() => getFilterRuleRows(initialFilters));

    function addRule() {
        setRows(latestRows => [...latestRows, getNewRow()]);
    }

    function removeRule(id: string) {
        setRows(latestRows => latestRows.filter(row => row.id !== id));
    }

    function updateRule(id: string, newRule: FilterRule) {
        setRows(latestRows => latestRows.map(row => (row.id === id ? { id: row.id, rule: newRule } : row)));
    }

    useUpdateEffect(() => {
        onChange(rows.map(getFilterRule));
    }, [rows]);

    return (
        <Form>
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
        </Form>
    );
};
export default FiltersDefinitionForm;
