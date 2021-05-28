import type { Filter, FilterUsage } from './types';
import type { FilterRule } from '../../common/src/filters/types';

export default class FilterActions {
    constructor(private toolbox: Stage.Types.Toolbox) {}

    doList(params: Record<string, any>): Promise<Stage.Types.PaginatedResponse<Filter>> {
        return this.toolbox.getManager().doGet(`/filters/deployments`, { params });
    }

    doDelete(filterId: string) {
        return this.toolbox.getManager().doDelete(`/filters/deployments/${filterId}`);
    }

    doGetFilterUsage(filterId: string): Promise<FilterUsage[]> {
        return this.toolbox.getInternal().doGet(`/filters/usage/${filterId}`);
    }

    doCreate(filterId: string, filterRules: FilterRule[]) {
        return this.toolbox
            .getManager()
            .doPut(`/filters/deployments/${filterId}`, { data: { filter_rules: filterRules } });
    }

    doUpdate(filterId: string, filterRules: FilterRule[]) {
        return this.toolbox.getManager().doPatch(`/filters/deployments/${filterId}`, { filter_rules: filterRules });
    }
}
