import type { GetFiltersUsageResponse } from 'backend/routes/Filters.types';
import type { QueryStringParams } from 'backend/sharedUtils';
import type { Filter, FilterRule } from './types';

export default class FilterActions {
    constructor(private toolbox: Stage.Types.Toolbox) {}

    doGet(filterId: string, params?: QueryStringParams) {
        return this.toolbox.getManager().doGet<Filter>(`/filters/deployments/${filterId}`, params);
    }

    doList(params: QueryStringParams): Promise<Stage.Types.PaginatedResponse<Filter>> {
        return this.toolbox.getManager().doGet(`/filters/deployments`, { params });
    }

    doDelete(filterId: string) {
        return this.toolbox.getManager().doDelete(`/filters/deployments/${filterId}`);
    }

    doGetFilterUsage(filterId: string) {
        return this.toolbox.getInternal().doGet<GetFiltersUsageResponse>(`/filters/usage/${filterId}`);
    }

    doCreate(filterId: string, filterRules: FilterRule[]) {
        return this.toolbox
            .getManager()
            .doPut(`/filters/deployments/${filterId}`, { body: { filter_rules: filterRules } });
    }

    doUpdate(filterId: string, filterRules: FilterRule[]) {
        return this.toolbox
            .getManager()
            .doPatch(`/filters/deployments/${filterId}`, { body: { filter_rules: filterRules } });
    }
}
