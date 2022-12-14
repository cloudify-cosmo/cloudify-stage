import i18n from 'i18next';
import type { FilterRuleOperator } from './types';
import { FilterRuleOperators } from './types';

const i18nPrefix = 'widgets.common.filters.form';
export const getTranslation = (key: string) => i18n.t(`${i18nPrefix}.${key}`);
export const getPlaceholderTranslation = (key: string) => getTranslation(`inputsPlaceholders.${key}`);
export const filterIdQueryParameterName = 'filterId';

const multipleValuesOperators: FilterRuleOperator[] = [
    FilterRuleOperators.AnyOf,
    FilterRuleOperators.NotAnyOf,
    FilterRuleOperators.IsNot
];
export function isMultipleValuesOperator(operator: FilterRuleOperator) {
    return multipleValuesOperators.includes(operator);
}
