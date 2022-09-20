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

export type PostWidgetsResponse = WidgetData;

export interface PostWidgetsQueryParams extends Query {
    url?: string;
}

export type PutWidgetsResponse = WidgetData;

export interface PutWidgetsQueryParams extends PostWidgetsQueryParams, Query {
    id: string;
}
