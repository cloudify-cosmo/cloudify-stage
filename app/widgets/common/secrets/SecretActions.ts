import type { Manager } from 'cloudify-ui-components/toolbox';
import type { Visibility } from '../types';

type ProviderOptions = Record<string, any>;

/* eslint-disable camelcase */
export type Secret = {
    created_at?: string;
    created_by?: string;
    is_hidden_value?: boolean;
    key: string;
    tenant_name?: string;
    updated_at?: string;
    visibility?: Visibility;
    value: string;
    schema: string;
    provider_name?: string;
    provider_options?: ProviderOptions;
};
/* eslint-enable camelcase */

export default class SecretActions {
    private manager;

    constructor(manager: Manager) {
        this.manager = manager;
    }

    doGet(key: Secret['key']): Promise<Secret> {
        return this.manager.doGet(`/secrets/${key}`);
    }

    doGetAllSecretProviders(): Promise<any> {
        return this.manager.doGet('/secrets-providers?_include=name');
    }

    doDelete(key: Secret['key']) {
        return this.manager.doDelete(`/secrets/${key}`);
    }

    doCreate(
        key: string,
        value: string,
        visibility: Visibility,
        hidden: boolean,
        provider?: string,
        providerOptions?: ProviderOptions
    ) {
        return this.manager.doPut(`/secrets/${key}`, {
            body: {
                value,
                visibility,
                is_hidden_value: hidden,
                provider,
                provider_options: providerOptions
            }
        });
    }

    doUpdate(key: Secret['key'], value: Secret['value']) {
        return this.manager.doPatch(`/secrets/${key}`, { body: { value } });
    }

    doSetIsHiddenValue(key: Secret['key'], hidden: Secret['is_hidden_value']) {
        return this.manager.doPatch(`/secrets/${key}`, { body: { is_hidden_value: hidden } });
    }

    doSetVisibility(key: Secret['key'], visibility: Visibility) {
        return this.manager.doPatch(`/secrets/${key}/set-visibility`, { body: { visibility } });
    }
}
