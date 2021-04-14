import type { FilterRuleOperator } from '../types';
import { FilterRuleOperators } from '../types';

// eslint-disable-next-line import/prefer-default-export
export function isAnyOfOrNotAnyOfOperator(operator: FilterRuleOperator) {
    return ([FilterRuleOperators.AnyOf, FilterRuleOperators.NotAnyOf] as FilterRuleOperator[]).includes(operator);
}
