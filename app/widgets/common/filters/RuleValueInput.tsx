import type { FunctionComponent } from 'react';
import React from 'react';

import type { FilterRule } from './types';
import { FilterRuleRowType } from './types';
import {
    BlueprintValueInput,
    CreatorValueInput,
    DisplayNameValueInput,
    InstallationStatusValueInput,
    LabelValueInput,
    SiteNameValueInput,
    TenantNameValueInput
} from './inputs';

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

    if (ruleType === FilterRuleRowType.Label) {
        return (
            <LabelValueInput
                {...commonProps}
                onKeyChange={onKeyChange}
                onValueChange={onValuesChange}
                labelKey={rule.key}
                labelValue={rule.values}
            />
        );
    }

    const attributeInputProps = { ...commonProps, onChange: onValuesChange, value: rule.values };
    const attributeInputComponents = {
        [FilterRuleRowType.Blueprint]: BlueprintValueInput,
        [FilterRuleRowType.Creator]: CreatorValueInput,
        [FilterRuleRowType.DisplayName]: DisplayNameValueInput,
        [FilterRuleRowType.InstallationStatus]: InstallationStatusValueInput,
        [FilterRuleRowType.SiteName]: SiteNameValueInput,
        [FilterRuleRowType.TenantName]: TenantNameValueInput
    };
    const AttributeInputComponent = attributeInputComponents[ruleType];
    return <AttributeInputComponent {...attributeInputProps} />;
};
export default RuleValueInput;
