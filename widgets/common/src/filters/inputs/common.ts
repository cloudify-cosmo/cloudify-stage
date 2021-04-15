import type { FilterRuleOperator } from '../types';
import { FilterRuleOperators } from '../types';
import { getTranslation } from '../common';

export function isAnyOperator(operator: FilterRuleOperator) {
    const anyOperators: FilterRuleOperator[] = [FilterRuleOperators.AnyOf, FilterRuleOperators.NotAnyOf];
    return anyOperators.includes(operator);
}

export function getPlaceholderTranslation(key: string) {
    return getTranslation(`inputsPlaceholders.${key}`);
}
