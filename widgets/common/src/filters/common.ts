import type { FilterRuleOperator } from './types';
import { FilterRuleOperators } from './types';

const { i18n } = Stage;
const i18nPrefix = 'widgets.common.filters.form';

export const getTranslation = (key: string) => i18n.t(`${i18nPrefix}.${key}`);

export function isAnyOperator(operator: FilterRuleOperator) {
    const anyOperators: FilterRuleOperator[] = [FilterRuleOperators.AnyOf, FilterRuleOperators.NotAnyOf];
    return anyOperators.includes(operator);
}
