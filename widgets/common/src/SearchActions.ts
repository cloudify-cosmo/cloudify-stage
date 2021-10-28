import { FilterRule } from './filters/types';

type ResourceName = 'blueprints' | 'deployments' | 'workflows';
type Params = Record<string, any>;
type ListDeploymentsParams = Stage.Types.ManagerGridParams & {
    // eslint-disable-next-line camelcase
    _search_name?: string;
    _include?: string;
};

type ListBlueprintsParams = Stage.Types.ManagerGridParams & {
    // eslint-disable-next-line camelcase
    _search_name?: string;
    _include?: string;
};

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

    doListDeployments(filterRules: FilterRule[], params?: ListDeploymentsParams) {
        return this.doList('deployments', filterRules, searchAlsoByDeploymentName(params));
    }

    doListAllDeployments(filterRules: FilterRule[], params?: ListDeploymentsParams) {
        return this.doListAll('deployments', filterRules, searchAlsoByDeploymentName(params));
    }

    doListBlueprints(filterRules: FilterRule[], params?: ListBlueprintsParams) {
        return this.doList('blueprints', filterRules, params);
    }

    doListAllWorkflows(filterRules: FilterRule[], params?: Params) {
        return this.doListAll('workflows', filterRules, params);
    }
}
function searchAlsoByDeploymentName(params?: ListDeploymentsParams): ListDeploymentsParams | undefined {
    // NOTE: that's how backend properties are named
    /* eslint-disable camelcase, no-underscore-dangle */
    if (!params || params._search_name || !params._search) {
        return params;
    }

    return {
        ...params,
        _search_name: params._search
    };
    /* eslint-enable camelcase, no-underscore-dangle */
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
