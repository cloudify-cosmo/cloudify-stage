import type { SecretProvidersWidget } from './widget.types';

export const tableRefreshEvent = 'secretProviders:refresh';
export const dataSortingKeys: Record<string, keyof SecretProvidersWidget.DataSortingKeys> = {
    name: 'name',
    type: 'type',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
} as const;
