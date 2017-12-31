/**
 * Created by jakubniezgoda on 28/03/2017.
 */

export default class {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGet(key) {
        return this.toolbox.getManager().doGet(`/secrets/${key}`);
    }

    doDelete(key) {
        return this.toolbox.getManager().doDelete(`/secrets/${key}`);
    }

    doCreate(key, value, visibility) {
        return this.toolbox.getManager().doPut(`/secrets/${key}`, null, {value, visibility});
    }

    doUpdate(key, value) {
        return this.toolbox.getManager().doPatch(`/secrets/${key}`, null, {value});
    }

    doSetVisibility(key, visibility) {
        return this.toolbox.getManager().doPatch(`/secrets/${key}/set-visibility`, null, {visibility});
    }
}