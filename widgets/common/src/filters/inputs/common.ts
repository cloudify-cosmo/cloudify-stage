import type { FilterRuleOperator } from '../types';
import { FilterRuleOperators } from '../types';
import { getTranslation } from '../common';

export function isAnyOperator(operator: FilterRuleOperator) {
    return ([FilterRuleOperators.AnyOf, FilterRuleOperators.NotAnyOf] as FilterRuleOperator[]).includes(operator);
}

export function getPlaceholderTranslation(key: string) {
    return getTranslation(`inputsPlaceholders.${key}`);
}
