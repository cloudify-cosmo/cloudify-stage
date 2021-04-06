import type { FunctionComponent } from 'react';
import RuleAttributeDropdown from './RuleAttributeDropdown';
import RuleOperatorDropdown from './RuleOperatorDropdown';
import RuleInput from './RuleInput';
import RuleRemoveButton from './RuleRemoveButton';

interface RuleRowProps {
    onRemove: () => void;
}

const RuleRow: FunctionComponent<RuleRowProps> = ({ onRemove }) => {
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
                <RuleRemoveButton onClick={onRemove} />
            </FormField>
        </FormGroup>
    );
};
export default RuleRow;
