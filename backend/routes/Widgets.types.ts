// eslint-disable-next-line import/no-unresolved,node/no-missing-import
import type { Query } from 'express-serve-static-core';

export interface WidgetData {
    id: string;
    isCustom: boolean;
}

export interface WidgetUsage {
    username: string;
    managerIp: string;
}

export type GetWidgetsListResponse = WidgetData[];

export type GetWidgetsUsedResponse = WidgetUsage[];

export type PutWidgetsInstallResponse = WidgetData;

export interface PutWidgetsInstallQueryParams extends Query {
    url?: string;
}

export type PutWidgetsUpdateResponse = WidgetData;

export interface PutWidgetsUpdateQueryParams extends PutWidgetsInstallQueryParams, Query {
    id: string;
}
