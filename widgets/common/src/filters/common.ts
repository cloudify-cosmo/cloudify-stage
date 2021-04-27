import type { FilterRuleOperator } from './types';
import { FilterRuleOperators } from './types';

const { i18n } = Stage;
const i18nPrefix = 'widgets.common.filters.form';
export const getTranslation = (key: string) => i18n.t(`${i18nPrefix}.${key}`);
export const getPlaceholderTranslation = (key: string) => getTranslation(`inputsPlaceholders.${key}`);

const anyOperators: FilterRuleOperator[] = [FilterRuleOperators.AnyOf, FilterRuleOperators.NotAnyOf];
export function isAnyOperator(operator: FilterRuleOperator) {
    return anyOperators.includes(operator);
}
