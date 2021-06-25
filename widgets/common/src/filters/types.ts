/** @see https://docs.cloudify.co/api/v3.1/#the-filter-resource */
export interface Filter {
    id: string;
    // eslint-disable-next-line camelcase
    created_by: string;
    // eslint-disable-next-line camelcase
    created_at: string;
    // eslint-disable-next-line camelcase
    labels_filter_rules: FilterRule[];
    // eslint-disable-next-line camelcase
    attrs_filter_rules: FilterRule[];
    // eslint-disable-next-line camelcase
    is_system_filter: boolean;
    value: FilterRule[];
}

export interface FilterUsage {
    pageName: string;
    widgetName: string;
    username: string;
}

export interface FilterRule {
    key: FilterRuleAttribute | LabelKey;
    values: string[];
    operator: FilterRuleOperator;
    type: FilterRuleType;
}

export enum FilterRuleAttribute {
    Blueprint = 'blueprint_id',
    SiteName = 'site_name',
    Creator = 'created_by'
}
type LabelKey = string;

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
