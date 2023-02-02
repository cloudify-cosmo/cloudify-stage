import type { PaginatedResponse } from 'backend/types';
import type { FullBlueprintData } from 'app/widgets/common/blueprints/BlueprintActions';
import type { Deployment } from '../deploymentsView/types';
import type { Workflow } from '../executeWorkflow';
import type { FilterRule } from '../filters/types';

type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

type ResourceName = 'blueprints' | 'deployments' | 'workflows';
type Params = Record<string, any>;
export type ListDeploymentsParams = Stage.Types.ManagerGridParams & {
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

    private doList<Resource>(resourceName: ResourceName, filterRules: FilterRule[], params?: Params) {
        return this.toolbox.getManager().doPost<PaginatedResponse<Resource>>(`/searches/${resourceName}`, {
            params,
            body: { filter_rules: filterRules }
        });
    }

    private doListAll<ResponseBody>(resourceName: ResourceName, filterRules: FilterRule[], params?: Params) {
        return this.toolbox.getManager().doPostFull<ResponseBody>(
            `/searches/${resourceName}`,
            {
                filter_rules: filterRules
            },
            params
        );
    }

    static searchAlsoByDeploymentName(params?: ListDeploymentsParams): ListDeploymentsParams | undefined {
        // NOTE: that's how backend properties are named
        /* eslint-disable camelcase, no-underscore-dangle */
        if (!params || params._search_name || !params._search) {
            return params;
        }

        return {
            ...params,
            _search_name: params._search
        };
    }

    doListDeployments<IncludeKeys extends keyof Deployment = keyof Deployment>(
        filterRules: FilterRule[],
        params?: ListDeploymentsParams
    ) {
        return this.doList<WithRequired<Deployment, IncludeKeys>>(
            'deployments',
            filterRules,
            SearchActions.searchAlsoByDeploymentName(params)
        );
    }

    doListAllDeployments(filterRules: FilterRule[], params?: ListDeploymentsParams) {
        return this.doListAll<Deployment>('deployments', filterRules, SearchActions.searchAlsoByDeploymentName(params));
    }

    doListBlueprints<IncludeKeys extends keyof FullBlueprintData>(
        filterRules: FilterRule[],
        params?: ListBlueprintsParams
    ) {
        return this.doList<WithRequired<FullBlueprintData, IncludeKeys>>('blueprints', filterRules, params);
    }

    doListAllWorkflows(filterRules: FilterRule[], params?: Params) {
        return this.doListAll<Workflow>('workflows', filterRules, params);
    }
}
