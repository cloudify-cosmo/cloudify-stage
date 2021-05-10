import { FilterRule } from './filters/types';

type ResourceName = 'blueprints' | 'deployments' | 'workflows';
type Params = Record<string, any> | null;

export default class SearchActions {
    constructor(private toolbox: Stage.Types.Toolbox) {}

    private doList(resourceName: ResourceName, filterRules: FilterRule[], params: Params = null) {
        return this.toolbox.getManager().doPostFull(`/searches/${resourceName}`, params, { filter_rules: filterRules });
    }

    doListDeployments(filterRules: FilterRule[], params: Params = null) {
        return this.doList('deployments', filterRules, params);
    }

    doListWorkflows(filterRules: FilterRule[], params: Params = null) {
        return this.doList('workflows', filterRules, params);
    }
}

declare global {
    namespace Stage.Common {
        export { SearchActions };
    }
}

Stage.defineCommon({
    name: 'SearchActions',
    common: SearchActions
});
