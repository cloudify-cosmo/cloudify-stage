import type { FunctionComponent } from 'react';
import RuleAttributeDropdown from './RuleAttributeDropdown';
import RuleOperatorDropdown from './RuleOperatorDropdown';
import RuleInput from './RuleInput';
import RuleRemoveButton from './RuleRemoveButton';

interface RuleRowProps {
    id: number;
    onRemove: (id: number) => void;
}

const RuleRow: FunctionComponent<RuleRowProps> = ({ id, onRemove }) => {
    const { UnsafelyTypedFormField: FormField, UnsafelyTypedFormGroup: FormGroup } = Stage.Basic;
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
