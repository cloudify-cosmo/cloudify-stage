import type { Manager } from 'cloudify-ui-components/toolbox';
import type { Visibility } from '../types';

export default class SecretActions {
    private manager;

    constructor(manager: Manager) {
        this.manager = manager;
    }

    doGet(key: string) {
        return this.manager.doGet(`/secrets/${key}`);
    }

    doDelete(key: string) {
        return this.manager.doDelete(`/secrets/${key}`);
    }

    doCreate(key: string, value: string, visibility: Visibility, hidden: boolean) {
        return this.manager.doPut(`/secrets/${key}`, { body: { value, visibility, is_hidden_value: hidden } });
    }

    doUpdate(key: string, value: string) {
        return this.manager.doPatch(`/secrets/${key}`, { body: { value } });
    }

    doSetIsHiddenValue(key: string, hidden: boolean) {
        return this.manager.doPatch(`/secrets/${key}`, { body: { is_hidden_value: hidden } });
    }

    doSetVisibility(key: string, visibility: Visibility) {
        return this.manager.doPatch(`/secrets/${key}/set-visibility`, { body: { visibility } });
    }
}
