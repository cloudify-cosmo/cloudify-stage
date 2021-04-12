import FiltersDefinitionForm from './FiltersDefinitionForm';

const Filters = {
    Form: FiltersDefinitionForm
};

// NOTE: alias name to avoid name shadowing inside the namespace
const FiltersAlias = Filters;
declare global {
    namespace Stage.Common {
        const Filters: typeof FiltersAlias;
    }
}

Stage.defineCommon({
    name: 'Filters',
    common: Filters
});
