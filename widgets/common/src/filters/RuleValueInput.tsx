import type { FunctionComponent } from 'react';

import type { FilterRule } from './types';
import { FilterRuleRowType } from './types';
import { BlueprintValueInput, SiteNameValueInput, CreatorValueInput, LabelValueInput } from './inputs';

interface RuleValueInputProps {
    onKeyChange: (key: string) => void;
    onValuesChange: (values: string[]) => void;
    ruleType: FilterRuleRowType;
    rule: FilterRule;

    toolbox: Stage.Types.WidgetlessToolbox;
}

const RuleValueInput: FunctionComponent<RuleValueInputProps> = ({
    onKeyChange,
    onValuesChange,
    ruleType,
    rule,
    toolbox
}) => {
    const commonProps = { operator: rule.operator, toolbox };
    const attributeInputProps = { ...commonProps, onChange: onValuesChange, value: rule.values };

    switch (ruleType) {
        case FilterRuleRowType.Blueprint:
            return <BlueprintValueInput {...attributeInputProps} />;
        case FilterRuleRowType.SiteName:
            return <SiteNameValueInput {...attributeInputProps} />;
        case FilterRuleRowType.Creator:
            return <CreatorValueInput {...attributeInputProps} />;
        case FilterRuleRowType.Label:
            return (
                <LabelValueInput
                    {...commonProps}
                    onKeyChange={onKeyChange}
                    onValueChange={onValuesChange}
                    labelKey={rule.key}
                    labelValue={rule.values}
                />
            );
        default:
            throw new Error('Unsupported filter rule row type was passed to RuleValueInput component.');
    }
};
export default RuleValueInput;
