import type { TokensWidget } from './widget.types';

export const tableRefreshEvent = 'tokens:refresh';
export const dataSortingKeys: Record<string, TokensWidget.DataSortingKeys> = {
    value: 'secret_hash',
    description: 'description',
    expirationDate: 'expiration_date',
    lastUsed: 'last_used'
} as const;
