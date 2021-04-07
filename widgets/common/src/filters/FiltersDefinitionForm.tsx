import { useState } from 'react';
import type { FunctionComponent } from 'react';

import RuleRow from './RuleRow';
import AddRuleButton from './AddRuleButton';
import type { FilterRule } from './types';

interface FilterRuleRow extends FilterRule {
    id: string;
}

function getNewRow() {
    const { uuid } = Stage.Utils;
    const defaultRow: FilterRuleRow = { id: '', type: 'label', key: '', operator: '', values: [] };

    return { ...defaultRow, id: uuid() };
}

const FiltersDefinitionForm: FunctionComponent = () => {
    const { UnsafelyTypedForm: Form } = Stage.Basic;
    const [rows, setRows] = useState(() => [getNewRow()]);

    function addRule() {
        setRows(latestRows => [...latestRows, getNewRow()]);
    }

    function removeRule(id: string) {
        setRows(latestRows => latestRows.filter(row => row.id !== id));
    }

    return (
        <Form>
            {rows.map(row => (
                <RuleRow key={row.id} removable={rows.length > 1} onRemove={() => removeRule(row.id)} />
            ))}
            <AddRuleButton onClick={addRule} />
        </Form>
    );
};
export default FiltersDefinitionForm;
