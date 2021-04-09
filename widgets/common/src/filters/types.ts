/** @see https://docs.cloudify.co/api/v3.1/#the-filter-resource */
export interface FilterRule {
    key: string;
    values: string[];
    operator: FilterRuleOperator;
    type: FilterRuleType;
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
    Contain = 'contain',
    NotContain = 'not_contain',
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
}

export enum FilterRuleRowType {
    Label = 'label',
    Blueprint = 'blueprint_id',
    SiteName = 'site_name',
    Creator = 'created_by'
}

export const FilterRuleOperators = { ...CommonRuleOperator, ...LabelsOnlyRuleOperator, ...AttributesOnlyRuleOperator };
export const LabelsFilterRuleOperators = { ...CommonRuleOperator, ...LabelsOnlyRuleOperator };
export const AttributesFilterRuleOperators = { ...CommonRuleOperator, ...AttributesOnlyRuleOperator };
