export type Visibility = 'private' | 'tenant' | 'global';

export default class SecretActions {
    private toolbox;

    constructor(toolbox: Stage.Types.WidgetlessToolbox) {
        this.toolbox = toolbox;
    }

    doGet(key: string) {
        return this.toolbox.getManager().doGet(`/secrets/${key}`);
    }

    doDelete(key: string) {
        return this.toolbox.getManager().doDelete(`/secrets/${key}`);
    }

    doCreate(key: string, value: string, visibility: Visibility, hidden: boolean) {
        return this.toolbox
            .getManager()
            .doPut(`/secrets/${key}`, { body: { value, visibility, is_hidden_value: hidden } });
    }

    doUpdate(key: string, value: string) {
        return this.toolbox.getManager().doPatch(`/secrets/${key}`, { body: { value } });
    }

    doSetIsHiddenValue(key: string, hidden: boolean) {
        return this.toolbox.getManager().doPatch(`/secrets/${key}`, { body: { is_hidden_value: hidden } });
    }

    doSetVisibility(key: string, visibility: Visibility) {
        return this.toolbox.getManager().doPatch(`/secrets/${key}/set-visibility`, { body: { visibility } });
    }
}
declare global {
    namespace Stage.Common {
        export { SecretActions };
    }
}

Stage.defineCommon({
    name: 'SecretActions',
    common: SecretActions
});
