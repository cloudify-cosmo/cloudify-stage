/** @see https://docs.cloudify.co/api/v3.1/#the-filter-resource */
interface LabelFilterRule {
    key: LabelKey;
    values: string[];
    operator: LabelRuleOperator;
    type: FilterRuleType.Label;
}
type LabelKey = string;

interface AttributeFilterRule {
    key: FilterRuleAttribute;
    values: string[];
    operator: AttributeRuleOperator;
    type: FilterRuleType.Attribute;
}
export type FilterRuleAttribute = Omit<FilterRuleRowType, FilterRuleRowType.Label>;

export type FilterRule = LabelFilterRule | AttributeFilterRule;

enum CommonRuleOperator {
    AnyOf = 'any_of',
    NotAnyOf = 'not_any_of'
}

enum LabelsOnlyRuleOperator {
    IsNot = 'is_not',
    IsNull = 'is_null',
    IsNotNull = 'is_not_null'
}

enum AttributesOnlyRuleOperator {
    Contains = 'contains',
    NotContains = 'not_contains',
    StartsWith = 'starts_with',
    EndsWith = 'ends_with'
}

type LabelRuleOperator = CommonRuleOperator | LabelsOnlyRuleOperator;
type AttributeRuleOperator = CommonRuleOperator | AttributesOnlyRuleOperator;
export type FilterRuleOperator = LabelRuleOperator | AttributeRuleOperator;

export enum FilterRuleType {
    Label = 'label',
    Attribute = 'attribute'
}

export interface FilterRuleRow {
    id: string;
    rule: FilterRule;
    hasError: boolean;
}

export enum FilterRuleRowType {
    Blueprint = 'blueprint_id',
    SiteName = 'site_name',
    Creator = 'created_by',
    Label = 'label'
}

export const FilterRuleOperators = { ...CommonRuleOperator, ...LabelsOnlyRuleOperator, ...AttributesOnlyRuleOperator };
export const LabelsFilterRuleOperators = { ...CommonRuleOperator, ...LabelsOnlyRuleOperator };
export const AttributesFilterRuleOperators = { ...CommonRuleOperator, ...AttributesOnlyRuleOperator };
