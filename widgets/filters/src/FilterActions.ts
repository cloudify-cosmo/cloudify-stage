export default class FilterActions {
    // eslint-disable-next-line no-useless-constructor
    constructor(private toolbox: Stage.Types.Toolbox) {}

    doList(params: unknown) {
        return this.toolbox.getManager().doGet(`/filters?_include=id,created_at,created_by`, params);
    }
}
