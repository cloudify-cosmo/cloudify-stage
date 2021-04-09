import type { ComponentProps, FunctionComponent } from 'react';

import RuleRowTypeDropdown from './RuleRowTypeDropdown';
import RuleOperatorDropdown from './RuleOperatorDropdown';
import RuleValueInput from './RuleValueInput';
import RuleRemoveButton from './RuleRemoveButton';
import type { FilterRule, FilterRuleOperator } from './types';
import { FilterRuleType, FilterRuleRowType } from './types';

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
    const ruleType = type === FilterRuleType.Label ? FilterRuleRowType.Label : (key as FilterRuleRowType);

    function onRuleTypeChange(newRuleType: FilterRuleRowType) {
        if (newRuleType === FilterRuleRowType.Label) {
            onChange({ ...rule, type: FilterRuleType.Label, key: '' });
        } else {
            onChange({ ...rule, type: FilterRuleType.Attribute, key: newRuleType });
        }
    }

    function onOperatorChange(newOperator: FilterRuleOperator) {
        onChange({ ...rule, operator: newOperator });
    }

    function onValuesChange(newValues: string[]) {
        onChange({ ...rule, values: newValues });
    }

    return (
        <FormGroup widths="equal">
            <FormField>
                <RuleRowTypeDropdown onChange={onRuleTypeChange} ruleType={ruleType} />
            </FormField>
            <FormField>
                <RuleOperatorDropdown onChange={onOperatorChange} operator={operator} ruleType={ruleType} />
            </FormField>
            <FormField>
                <RuleValueInput
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
