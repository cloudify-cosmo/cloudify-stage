import { FilterRule } from './filters/types';

type ResourceName = 'blueprints' | 'deployments' | 'workflows';
type Params = Record<string, any>;

export default class SearchActions {
    constructor(private toolbox: Stage.Types.Toolbox) {}

    private doList(resourceName: ResourceName, filterRules: FilterRule[], params?: Params) {
        return this.toolbox
            .getManager()
            .doPost(`/searches/${resourceName}`, { params, body: { filter_rules: filterRules } });
    }

    private doListAll(resourceName: ResourceName, filterRules: FilterRule[], params?: Params) {
        return this.toolbox.getManager().doPostFull(`/searches/${resourceName}`, params, { filter_rules: filterRules });
    }

    doListDeployments(filterRules: FilterRule[], params?: Params) {
        return this.doList('deployments', filterRules, params);
    }

    doListAllDeployments(filterRules: FilterRule[], params?: Params) {
        return this.doListAll('deployments', filterRules, params);
    }

    doListAllWorkflows(filterRules: FilterRule[], params?: Params) {
        return this.doListAll('workflows', filterRules, params);
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
