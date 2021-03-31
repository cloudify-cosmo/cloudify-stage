import { useState } from 'react';
import type { FunctionComponent } from 'react';

import Form from './FormWrapper';
import RuleRow from './RuleRow';
import AddRuleButton from './AddRuleButton';

const defaultRow = { attribute: '', operator: '', input: '' };

const FiltersDefinitionForm: FunctionComponent = () => {
    const [rows, setRows] = useState([defaultRow]);

    function addRule() {
        const newRows = [...rows, defaultRow];
        setRows(newRows);
    }

    function removeRule(id: number) {
        const newRows = _.filter(rows, (_rowObject, rowId) => rowId !== id);
        setRows(newRows);
    }

    return (
        <Form>
            {rows.map((_row, index) => (
                // TODO: Change key not to use index
                // eslint-disable-next-line react/no-array-index-key
                <RuleRow key={index} id={index} onRemove={removeRule} />
            ))}
            <AddRuleButton onClick={addRule} />
        </Form>
    );
};
export default FiltersDefinitionForm;
