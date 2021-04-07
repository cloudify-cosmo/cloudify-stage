/** @see https://docs.cloudify.co/api/v3.1/#the-filter-resource */
export interface FilterRule {
    key: string;
    values: string[];
    operator: string;
    type: 'label' | 'attribute';
}
