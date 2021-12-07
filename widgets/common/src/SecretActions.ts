// @ts-nocheck File not migrated fully to TS
export {};

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
        return this.toolbox
            .getManager()
            .doPut(`/secrets/${key}`, { body: { value, visibility, is_hidden_value: hidden } });
    }

    doUpdate(key, value) {
        return this.toolbox.getManager().doPatch(`/secrets/${key}`, { body: { value } });
    }

    doSetIsHiddenValue(key, hidden) {
        return this.toolbox.getManager().doPatch(`/secrets/${key}`, { body: { is_hidden_value: hidden } });
    }

    doSetVisibility(key, visibility) {
        return this.toolbox.getManager().doPatch(`/secrets/${key}/set-visibility`, { body: { visibility } });
    }
}
declare global {
    namespace Stage.Common {
        export default { SecretActions };
    }
}

Stage.defineCommon({
    name: 'SecretActions',
    common: SecretActions
});
