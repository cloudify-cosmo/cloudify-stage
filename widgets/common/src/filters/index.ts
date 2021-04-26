import RulesForm from './RulesForm';
import { FilterRule } from './types';

const Filters = {
    RulesForm
};

// NOTE: alias name to avoid name shadowing inside the namespace
const FiltersAlias = Filters;
declare global {
    namespace Stage.Common {
        // eslint-disable-next-line @typescript-eslint/no-namespace
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
