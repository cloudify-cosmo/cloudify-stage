export default class FilterActions {
    toolbox: Stage.Types.Toolbox;

    constructor(toolbox: Stage.Types.Toolbox) {
        this.toolbox = toolbox;
    }

    doList(params: unknown) {
        return this.toolbox.getManager().doGet(`/filters?_include=id,created_at,created_by`, params);
    }
}
