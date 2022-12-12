import type { SecretProvidersWidget } from './widget.types';

export const tableRefreshEvent = 'secretProviders:refresh';
export const dataSortingKeys: Record<string, keyof SecretProvidersWidget.DataSortingKeys> = {
    name: 'name',
    type: 'type',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
} as const;
const translationSecretProvider = Stage.Utils.getT('widgets.secretProviders');

export const translateSecretProviders = (key: string, params?: Record<string, any>) => {
    return translationSecretProvider(key, params);
};
