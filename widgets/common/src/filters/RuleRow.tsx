import type { ComponentProps, FunctionComponent } from 'react';

import RuleRowTypeDropdown from './RuleRowTypeDropdown';
import RuleOperatorDropdown from './RuleOperatorDropdown';
import RuleValueInput from './RuleValueInput';
import RuleRemoveButton from './RuleRemoveButton';
import type { FilterRule, FilterRuleOperator } from './types';
import { FilterRuleType, FilterRuleRowType, FilterRuleOperators } from './types';

interface RuleRowProps {
    onRemove: ComponentProps<typeof Button>['onClick'];
    onChange: (rule: FilterRule) => void;
    removable: boolean;
    rule: FilterRule;
    toolbox: Stage.Types.Toolbox;
}

const defaultOperator = FilterRuleOperators.AnyOf;
const defaultValues: string[] = [];
const defaultOperatorAndValues = { operator: defaultOperator, values: defaultValues };

const RuleRow: FunctionComponent<RuleRowProps> = ({ onChange, onRemove, removable, rule, toolbox }) => {
    const { UnsafelyTypedFormField: FormField, UnsafelyTypedFormGroup: FormGroup } = Stage.Basic;
    const { key, operator, type } = rule;
    const ruleType = type === FilterRuleType.Label ? FilterRuleRowType.Label : (key as FilterRuleRowType);

    function onRuleTypeChange(newRuleType: FilterRuleRowType) {
        if (newRuleType === FilterRuleRowType.Label) {
            onChange({ ...rule, type: FilterRuleType.Label, ...defaultOperatorAndValues, key: '' });
        } else {
            onChange({ ...rule, type: FilterRuleType.Attribute, ...defaultOperatorAndValues, key: newRuleType });
        }
    }

    function onOperatorChange(newOperator: FilterRuleOperator) {
        onChange({ ...rule, operator: newOperator, values: defaultValues });
    }

    function onKeyChange(newKey: string) {
        onChange({ ...rule, key: newKey, values: defaultValues });
    }

    function onValuesChange(newValues: string[]) {
        onChange({ ...rule, values: newValues });
    }

    return (
        <FormGroup widths="equal">
            <FormField>
                <RuleRowTypeDropdown onChange={onRuleTypeChange} value={ruleType} />
            </FormField>
            <FormField>
                <RuleOperatorDropdown onChange={onOperatorChange} value={operator} ruleType={ruleType} />
            </FormField>
            <FormField>
                <RuleValueInput
                    onKeyChange={onKeyChange}
                    onValuesChange={onValuesChange}
                    ruleType={ruleType}
                    rule={rule}
                    toolbox={toolbox}
                />
            </FormField>
            <FormField>{removable && <RuleRemoveButton onClick={onRemove} />}</FormField>
        </FormGroup>
    );
};
export default RuleRow;
