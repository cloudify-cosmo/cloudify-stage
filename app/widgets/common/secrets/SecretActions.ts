import type { Manager } from 'cloudify-ui-components/toolbox';
import type { Visibility } from '../types';

/* eslint-disable camelcase */
export type Secret = {
    created_at?: string;
    created_by?: string;
    is_hidden_value?: boolean;
    key: string;
    resource_availability?: string;
    tenant_name?: string;
    updated_at?: string;
    visibility?: Visibility;
};
/* eslint-enable camelcase */

export default class SecretActions {
    private manager;

    constructor(manager: Manager) {
        this.manager = manager;
    }

    doGet(key: Secret['key']) {
        return this.manager.doGet(`/secrets/${key}`);
    }

    doDelete(key: Secret['key']) {
        return this.manager.doDelete(`/secrets/${key}`);
    }

    doCreate(key: Secret['key'], value: string, visibility: Visibility, hidden: Secret['is_hidden_value']) {
        return this.manager.doPut(`/secrets/${key}`, { body: { value, visibility, is_hidden_value: hidden } });
    }

    doUpdate(key: Secret['key'], value: string) {
        return this.manager.doPatch(`/secrets/${key}`, { body: { value } });
    }

    doSetIsHiddenValue(key: Secret['key'], hidden: Secret['is_hidden_value']) {
        return this.manager.doPatch(`/secrets/${key}`, { body: { is_hidden_value: hidden } });
    }

    doSetVisibility(key: Secret['key'], visibility: Visibility) {
        return this.manager.doPatch(`/secrets/${key}/set-visibility`, { body: { visibility } });
    }
}
