import type { SecretProvidersWidget } from './widget.types';

export const tableRefreshEvent = 'tokens:refresh';
export const dataSortingKeys: Record<string, SecretProvidersWidget.DataSortingKeys> = {
    value: 'provider_name',
    type: 'provider_type',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
} as const;
