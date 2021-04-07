import type { ComponentProps, FunctionComponent } from 'react';
import RuleAttributeDropdown from './RuleAttributeDropdown';
import RuleOperatorDropdown from './RuleOperatorDropdown';
import RuleInput from './RuleInput';
import RuleRemoveButton from './RuleRemoveButton';

interface RuleRowProps {
    allowRemove: boolean;
    onRemove: ComponentProps<typeof Button>['onClick'];
}

const RuleRow: FunctionComponent<RuleRowProps> = ({ allowRemove = true, onRemove }) => {
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
            <FormField>{allowRemove && <RuleRemoveButton onClick={onRemove} />}</FormField>
        </FormGroup>
    );
};
export default RuleRow;
