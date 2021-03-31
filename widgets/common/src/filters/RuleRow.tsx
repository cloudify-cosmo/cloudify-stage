import type { FunctionComponent } from 'react';
import RuleAttributeDropdown from './RuleAttributeDropdown';
import RuleOperatorDropdown from './RuleOperatorDropdown';
import RuleInput from './RuleInput';
import RuleRemoveButton from './RuleRemoveButton';
import { FormField, FormGroup } from './FormWrapper';

interface RuleRowProps {
    id: number;
    onRemove: (id: number) => void;
}

const RuleRow: FunctionComponent<RuleRowProps> = ({ id, onRemove }) => {
    return (
        <FormGroup widths="equal">
            <FormField>
                <RuleAttributeDropdown />
            </FormField>
            <FormField>
                <RuleOperatorDropdown />
            </FormField>
            <FormField>
                <RuleInput />
            </FormField>
            <FormField>
                <RuleRemoveButton onClick={() => onRemove(id)} />
            </FormField>
        </FormGroup>
    );
};
export default RuleRow;
