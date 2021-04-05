import type { Filter } from './types';

export default class FilterActions {
    constructor(private toolbox: Stage.Types.Toolbox) {}

    doList(params: unknown): Promise<Stage.Types.PaginatedResponse<Filter>> {
        return this.toolbox.getManager().doGet(`/filters?_include=id,created_at,created_by`, params);
    }

    doDelete(filterId: string) {
        return this.toolbox.getManager().doDelete(`/filters/${filterId}`);
    }
}
