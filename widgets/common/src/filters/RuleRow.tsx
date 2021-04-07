import type { ComponentProps, FunctionComponent } from 'react';
import RuleAttributeDropdown from './RuleAttributeDropdown';
import RuleOperatorDropdown from './RuleOperatorDropdown';
import RuleInput from './RuleInput';
import RuleRemoveButton from './RuleRemoveButton';

interface RuleRowProps {
    removable: boolean;
    onRemove: ComponentProps<typeof Button>['onClick'];
}

const RuleRow: FunctionComponent<RuleRowProps> = ({ removable, onRemove }) => {
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
            {removable && (
                <FormField>
                    <RuleRemoveButton onClick={onRemove} />
                </FormField>
            )}
        </FormGroup>
    );
};
export default RuleRow;
