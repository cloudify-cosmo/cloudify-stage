import FiltersDefinitionForm from './FiltersDefinitionForm';

const Filters = {
    Form: FiltersDefinitionForm
};

declare global {
    namespace Stage {
        interface Common {
            Filters: typeof Filters;
        }
    }
}

Stage.defineCommon({
    name: 'Filters',
    common: Filters
});
