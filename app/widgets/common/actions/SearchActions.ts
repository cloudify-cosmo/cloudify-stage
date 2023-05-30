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

type SearchOptions<ListingParameters extends Params = Params> =
    | { filterRules: FilterRule[]; params?: ListingParameters }
    | { filterId: string; params?: ListingParameters };

const getSearchBodyPayload = (options: SearchOptions) => {
    return 'filterId' in options ? { filter_id: options.filterId } : { filter_rules: options.filterRules };
};

export default class SearchActions {
    constructor(private toolbox: Stage.Types.Toolbox) {}

    private doList<Resource>(resourceName: ResourceName, options: SearchOptions) {
        return this.toolbox.getManager().doPost<PaginatedResponse<Resource>>(`/searches/${resourceName}`, {
            params: options.params,
            body: getSearchBodyPayload(options)
        });
    }

    private doListAll<ResponseBody>(resourceName: ResourceName, options: SearchOptions) {
        return this.toolbox
            .getManager()
            .doPostFull<ResponseBody>(`/searches/${resourceName}`, getSearchBodyPayload(options), options.params);
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
        return this.doList<Pick<FullDeploymentData, IncludeKeys>>('deployments', {
            filterRules,
            params: SearchActions.searchAlsoByDeploymentName(params)
        });
    }

    doListAllDeployments(filterRules: FilterRule[], params?: ListDeploymentsParams) {
        return this.doListAll<FullDeploymentData>('deployments', {
            filterRules,
            params: SearchActions.searchAlsoByDeploymentName(params)
        });
    }

    doListBlueprints<IncludeKeys extends keyof FullBlueprintData>(options: SearchOptions<ListBlueprintsParams>) {
        return this.doList<Pick<FullBlueprintData, IncludeKeys>>('blueprints', options);
    }

    doListAllWorkflows<IncludeKeys extends keyof Workflow>(filterRules: FilterRule[], params?: Params) {
        return this.doListAll<Pick<Workflow, IncludeKeys>>('workflows', {
            filterRules,
            params
        });
    }
}
