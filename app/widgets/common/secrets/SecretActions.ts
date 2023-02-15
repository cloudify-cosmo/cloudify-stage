import type { Manager } from 'cloudify-ui-components/toolbox';

import type { Visibility } from '../types';

const getSecretProviderOptions = (path: string): ProviderOptions => ({ path });

export type ProviderOptions = Record<string, string>;

/* eslint-disable camelcase */
export type Secret = {
    created_at: string;
    created_by: string;
    is_hidden_value: boolean;
    key: string;
    tenant_name: string;
    updated_at: string;
    visibility: Visibility;
    value: string;
    schema: Record<string, any>;
    provider_name: string;
    provider_options: string;
};

type CreateSecretRequestBody = Pick<Secret, 'value' | 'visibility' | 'is_hidden_value'> & {
    provider_name?: string;
    provider_options?: ProviderOptions;
};

type UpdateSecretRequestBody = Partial<CreateSecretRequestBody>;

/* eslint-enable camelcase */

export default class SecretActions {
    private manager;

    constructor(manager: Manager) {
        this.manager = manager;
    }

    doGet(key: Secret['key']): Promise<Secret> {
        return this.manager.doGet(`/secrets/${key}`);
    }

    doGetWithoutValue(key: Secret['key']) {
        return this.manager.doGet<Omit<Secret, 'value'>>(`/secrets/${key}?_skip_value=true`);
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
        providerName?: string,
        providerPath?: string
    ) {
        const body: CreateSecretRequestBody = {
            value,
            visibility,
            is_hidden_value: hidden
        };
        if (providerName && providerPath) {
            body.provider_name = providerName;
            body.provider_options = getSecretProviderOptions(providerPath);
        }
        return this.manager.doPut<Secret, CreateSecretRequestBody>(`/secrets/${key}`, { body });
    }

    doUpdate(key: Secret['key'], value?: string, providerName?: string, providerPath?: string) {
        const body: UpdateSecretRequestBody = { value };
        if (providerName && providerPath) {
            body.provider_name = providerName;
            body.provider_options = getSecretProviderOptions(providerPath);
        }
        return this.manager.doPatch<Secret, UpdateSecretRequestBody>(`/secrets/${key}`, { body });
    }

    doSetIsHiddenValue(key: Secret['key'], hidden: Secret['is_hidden_value']) {
        return this.manager.doPatch(`/secrets/${key}`, { body: { is_hidden_value: hidden } });
    }

    doSetVisibility(key: Secret['key'], visibility: Visibility) {
        return this.manager.doPatch(`/secrets/${key}/set-visibility`, { body: { visibility } });
    }
}
