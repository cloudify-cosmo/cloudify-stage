import { omit } from 'lodash';
import { useState } from 'react';
import type { FunctionComponent } from 'react';

import RuleRow from './RuleRow';
import AddRuleButton from './AddRuleButton';
import type { FilterRule, FilterRuleRow } from './types';
import { FilterRuleType, FilterRuleOperators } from './types';

function getNewRow() {
    const { uuid } = Stage.Utils;

    const emptyRow: FilterRuleRow = {
        id: uuid(),
        type: FilterRuleType.Label,
        key: '',
        operator: FilterRuleOperators.AnyOf,
        values: []
    };

    return emptyRow;
}

function getFilterRuleRows(filterRules: FilterRule[]): FilterRuleRow[] {
    const { uuid } = Stage.Utils;

    return filterRules.length > 0 ? filterRules.map(filterRule => ({ ...filterRule, id: uuid() })) : [getNewRow()];
}

function getFilterRule(filterRuleRow: FilterRuleRow): FilterRule {
    return omit(filterRuleRow, 'id');
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
        setRows(latestRows => latestRows.map(row => (row.id === id ? { ...row, ...newRule } : row)));
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
                    onChange={(value: FilterRule) => updateRule(row.id, value)}
                    onRemove={() => removeRule(row.id)}
                    toolbox={toolbox}
                />
            ))}
            <AddRuleButton onClick={addRule} />
        </Form>
    );
};
export default FiltersDefinitionForm;
