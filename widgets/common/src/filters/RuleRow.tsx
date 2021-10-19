import type { ComponentProps, FunctionComponent } from 'react';

import RuleRowTypeDropdown from './RuleRowTypeDropdown';
import RuleOperatorDropdown from './RuleOperatorDropdown';
import RuleValueInput from './RuleValueInput';
import RuleRemoveButton from './RuleRemoveButton';
import type { FilterRule, FilterRuleOperator } from './types';
import { FilterRuleType, FilterRuleRowType, FilterRuleOperators } from './types';

interface RuleRowProps {
    onRemove: ComponentProps<typeof RuleRemoveButton>['onClick'];
    onChange: (rule: FilterRule) => void;
    removable: boolean;
    error: boolean;
    rule: FilterRule;
    collectionName: string;
    toolbox: Stage.Types.Toolbox | Stage.Types.WidgetlessToolbox;
}

const defaultOperator = FilterRuleOperators.AnyOf;
const defaultValues: string[] = [];
const defaultOperatorAndValues = { operator: defaultOperator, values: defaultValues };

const RuleRow: FunctionComponent<RuleRowProps> = ({
    collectionName,
    onChange,
    onRemove,
    removable,
    error,
    rule,
    toolbox
}) => {
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
            <FormField width={4}>
                <RuleRowTypeDropdown onChange={onRuleTypeChange} value={ruleType} />
            </FormField>
            <FormField width={4}>
                <RuleOperatorDropdown onChange={onOperatorChange} value={operator} ruleType={ruleType} />
            </FormField>
            <FormField width={7} error={error}>
                <RuleValueInput
                    onKeyChange={onKeyChange}
                    onValuesChange={onValuesChange}
                    collectionName={collectionName}
                    ruleType={ruleType}
                    rule={rule}
                    toolbox={toolbox}
                />
            </FormField>
            <FormField width={1}>{removable && <RuleRemoveButton onClick={onRemove} />}</FormField>
        </FormGroup>
    );
};
export default RuleRow;
