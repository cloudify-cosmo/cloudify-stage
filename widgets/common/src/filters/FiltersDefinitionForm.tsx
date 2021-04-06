import { useState } from 'react';
import type { FunctionComponent } from 'react';

import RuleRow from './RuleRow';
import AddRuleButton from './AddRuleButton';

const defaultRow = { id: '', attribute: '', operator: '', input: '' };

const FiltersDefinitionForm: FunctionComponent = () => {
    const { UnsafelyTypedForm: Form } = Stage.Basic;
    const [rows, setRows] = useState([defaultRow]);

    function addRule() {
        const { uuid } = Stage.Utils;
        setRows(() => [...rows, { ...defaultRow, id: uuid() }]);
    }

    function removeRule(id: string) {
        setRows(() => rows.filter(row => row.id !== id));
    }

    return (
        <Form>
            {rows.map(row => (
                <RuleRow key={row.id} onRemove={() => removeRule(row.id)} />
            ))}
            <AddRuleButton onClick={addRule} />
        </Form>
    );
};
export default FiltersDefinitionForm;
