import type { FunctionComponent } from 'react';
import { useEffect, useRef } from 'react';

import { LabelsFilterRuleOperators, FilterRuleRowType, FilterRuleOperator } from './types';
import LabelKeyDropdown from '../labels/KeyDropdown';
import LabelValueDropdown from '../labels/ValueDropdown';

interface RuleOperatorDropdownProps {
    onChange: (value: string[]) => void;
    operator: FilterRuleOperator;
    ruleType: FilterRuleRowType;
    toolbox: Stage.Types.Toolbox;
    values: string[];
}

const RuleInput: FunctionComponent<RuleOperatorDropdownProps> = ({ onChange, operator, ruleType, toolbox, values }) => {
    const { Input } = Stage.Basic;
    const keyDropdownRef = useRef();
    const [labelKey, labelValue] = values;

    useEffect(() => {
        if (
            ruleType === FilterRuleRowType.Label &&
            (operator === LabelsFilterRuleOperators.IsNull || operator === LabelsFilterRuleOperators.IsNotNull)
        ) {
            onChange([labelKey]);
        }
    }, [ruleType, operator]);

    if (ruleType === FilterRuleRowType.Label) {
        return (
            // TODO(RD-2007): Add better styling
            <>
                <LabelKeyDropdown
                    innerRef={keyDropdownRef}
                    onChange={newKey => onChange([newKey])}
                    toolbox={toolbox}
                    value={labelKey}
                />
                {(operator === LabelsFilterRuleOperators.AnyOf || operator === LabelsFilterRuleOperators.NotAnyOf) && (
                    // TODO(RD-2006): Add support for multiple additions
                    <LabelValueDropdown
                        labelKey={labelKey}
                        onChange={newValue => onChange([labelKey, newValue])}
                        toolbox={toolbox}
                        value={labelValue}
                    />
                )}
            </>
        );
    }

    // TODO(RD-1761, RD-1762, RD-1764): Provide multiple selection dropdowns with autocompletion
    const textValue = values[0] || '';
    return <Input type="text" onChange={(_event, { value }) => onChange([value])} value={textValue} />;
};
export default RuleInput;
