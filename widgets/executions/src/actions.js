/**
 * Created by jakubniezgoda on 10/05/2018.
 */

export default class {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGetUpdate(id) {
        return this.toolbox.getManager().doGet(`/deployment-updates/${id}`);
    }
}