import type { UserAppsData } from '../db/models/UserAppsModel.types';

export type GetUserAppResponse = UserAppsData | null;

export type PostUserAppResponse = UserAppsData;

export type PostUserAppRequestBody = {
    appData: UserAppsData['appData'];
    version: UserAppsData['appDataVersion'];
};

export interface GetUserAppClearPagesRequestQueryParams {
    tenant?: string;
}
