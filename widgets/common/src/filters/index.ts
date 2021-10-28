import RulesForm from './RulesForm';
import FilterActions from './FilterActions';
import FilterIdDropdown from './FilterIdDropdown';
import { FilterRule, FilterRuleOperators, FilterRuleType } from './types';
import { filterIdQueryParameterName } from './common';

const Filters = {
    Actions: FilterActions,
    FilterIdDropdown,
    filterIdQueryParameterName,
    RulesForm,
    FilterRuleOperators,
    FilterRuleType
};

// NOTE: alias name to avoid name shadowing inside the namespace
const FiltersAlias = Filters;
declare global {
    namespace Stage.Common {
        namespace Filters {
            export type Rule = FilterRule;
        }
        const Filters: typeof FiltersAlias;
    }
}

Stage.defineCommon({
    name: 'Filters',
    common: Filters
});
