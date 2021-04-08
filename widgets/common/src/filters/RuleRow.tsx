import type { ComponentProps, FunctionComponent } from 'react';

import RuleTypeDropdown from './RuleTypeDropdown';
import RuleOperatorDropdown from './RuleOperatorDropdown';
import RuleInput from './RuleInput';
import RuleRemoveButton from './RuleRemoveButton';
import { RuleType } from './types';
import type { FilterRule, RuleOperator } from './types';

interface RuleRowProps {
    onRemove: ComponentProps<typeof Button>['onClick'];
    onChange: (rule: FilterRule) => void;
    removable: boolean;
    rule: FilterRule;
    toolbox: Stage.Types.Toolbox;
}

const RuleRow: FunctionComponent<RuleRowProps> = ({ onChange, onRemove, removable, rule, toolbox }) => {
    const { UnsafelyTypedFormField: FormField, UnsafelyTypedFormGroup: FormGroup } = Stage.Basic;
    const { key, operator, type, values } = rule;
    const ruleType = type === RuleType.Label ? RuleType.Label : (key as RuleType);

    function onRuleTypeChange(newRuleType: RuleType) {
        if (newRuleType === RuleType.Label) {
            onChange({ ...rule, type: 'label', key: '' });
        } else {
            onChange({ ...rule, type: 'attribute', key: newRuleType });
        }
    }

    function onOperatorChange(newOperator: RuleOperator) {
        onChange({ ...rule, operator: newOperator });
    }

    function onValuesChange(newValues: string[]) {
        onChange({ ...rule, values: newValues });
    }

    return (
        <FormGroup widths="equal">
            <FormField>
                <RuleTypeDropdown onChange={onRuleTypeChange} ruleType={ruleType} />
            </FormField>
            <FormField>
                <RuleOperatorDropdown onChange={onOperatorChange} operator={operator} ruleType={ruleType} />
            </FormField>
            <FormField>
                <RuleInput
                    onChange={onValuesChange}
                    operator={operator}
                    ruleType={ruleType}
                    values={values}
                    toolbox={toolbox}
                />
            </FormField>
            <FormField>{removable && <RuleRemoveButton onClick={onRemove} />}</FormField>
        </FormGroup>
    );
};
export default RuleRow;
