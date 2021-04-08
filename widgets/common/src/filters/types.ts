/** @see https://docs.cloudify.co/api/v3.1/#the-filter-resource */
export interface FilterRule {
    key: string;
    values: string[];
    operator: RuleOperator;
    type: 'label' | 'attribute';
}

export interface FilterRuleRow extends FilterRule {
    id: string;
}

export enum RuleType {
    Label = 'label',
    Blueprint = 'blueprint_id',
    SiteName = 'site_name',
    Creator = 'created_by'
}

export enum CommonRuleOperator {
    AnyOf = 'any_of',
    NotAnyOf = 'not_any_of'
}

export enum LabelsOnlyRuleOperator {
    IsNull = 'is_null',
    IsNotNull = 'is_not_null'
}

enum AttributesOnlyRuleOperator {
    Contain = 'contain',
    NotContain = 'not_contain',
    StartsWith = 'starts_with',
    EndsWith = 'ends_with'
}

export const RuleOperator = { ...CommonRuleOperator, ...LabelsOnlyRuleOperator, ...AttributesOnlyRuleOperator };
export type RuleOperator = CommonRuleOperator | LabelsOnlyRuleOperator | AttributesOnlyRuleOperator;

export const LabelsRuleOperator = { ...CommonRuleOperator, ...LabelsOnlyRuleOperator };
export type LabelsRuleOperator = CommonRuleOperator | LabelsOnlyRuleOperator;

export const AttributesRuleOperator = { ...CommonRuleOperator, ...AttributesOnlyRuleOperator };
export type AttributesRuleOperator = CommonRuleOperator | AttributesOnlyRuleOperator;
