import type { PaginatedResponse } from 'backend/types';
import type { FullBlueprintData } from '../blueprints/BlueprintActions';
import type { FullDeploymentData } from '../deployments/DeploymentActions';
import type { Workflow } from '../executeWorkflow';
import type { FilterRule } from '../filters/types';

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

    doListDeployments<IncludeKeys extends keyof FullDeploymentData = keyof FullDeploymentData>(
        filterRules: FilterRule[],
        params?: ListDeploymentsParams
    ) {
        return this.doList<Pick<FullDeploymentData, IncludeKeys>>(
            'deployments',
            filterRules,
            SearchActions.searchAlsoByDeploymentName(params)
        );
    }

    doListAllDeployments(filterRules: FilterRule[], params?: ListDeploymentsParams) {
        return this.doListAll<FullDeploymentData>(
            'deployments',
            filterRules,
            SearchActions.searchAlsoByDeploymentName(params)
        );
    }

    doListBlueprints<IncludeKeys extends keyof FullBlueprintData>(
        filterRules: FilterRule[],
        params?: ListBlueprintsParams
    ) {
        return this.doList<Pick<FullBlueprintData, IncludeKeys>>('blueprints', filterRules, params);
    }

    doListAllWorkflows<IncludeKeys extends keyof Workflow>(filterRules: FilterRule[], params?: Params) {
        return this.doListAll<Pick<Workflow, IncludeKeys>>('workflows', filterRules, params);
    }
}
