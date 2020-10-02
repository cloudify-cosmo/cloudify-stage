/**
 * Created by jakubniezgoda on 28/03/2017.
 */

class SecretActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGet(key) {
        return this.toolbox.getManager().doGet(`/secrets/${key}`);
    }

    doDelete(key) {
        return this.toolbox.getManager().doDelete(`/secrets/${key}`);
    }

    doCreate(key, value, visibility, hidden) {
        return this.toolbox.getManager().doPut(`/secrets/${key}`, null, { value, visibility, is_hidden_value: hidden });
    }

    doUpdate(key, value) {
        return this.toolbox.getManager().doPatch(`/secrets/${key}`, null, { value });
    }

    doSetIsHiddenValue(key, hidden) {
        return this.toolbox.getManager().doPatch(`/secrets/${key}`, null, { is_hidden_value: hidden });
    }

    doSetVisibility(key, visibility) {
        return this.toolbox.getManager().doPatch(`/secrets/${key}/set-visibility`, null, { visibility });
    }
}

Stage.defineCommon({
    name: 'SecretActions',
    common: SecretActions
});
