/** @see https://docs.cloudify.co/api/v3.1/#the-filter-resource */
export interface FilterRule {
    key: FilterRuleAttributes | string;
    values: string[];
    operator: FilterRuleOperator;
    type: FilterRuleType;
}

export enum FilterRuleAttributes {
    Blueprint = 'blueprint_id',
    SiteName = 'site_name',
    Creator = 'created_by'
}

enum CommonRuleOperator {
    AnyOf = 'any_of',
    NotAnyOf = 'not_any_of'
}

enum LabelsOnlyRuleOperator {
    IsNull = 'is_null',
    IsNotNull = 'is_not_null'
}

enum AttributesOnlyRuleOperator {
    Contains = 'contains',
    NotContains = 'not_contains',
    StartsWith = 'starts_with',
    EndsWith = 'ends_with'
}

export type FilterRuleOperator = CommonRuleOperator | LabelsOnlyRuleOperator | AttributesOnlyRuleOperator;

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
