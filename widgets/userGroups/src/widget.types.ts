import type { UserGroupResponse } from 'backend/handler/AuthHandler.types';
import type { DataTableConfiguration, PollingTimeConfiguration } from '../../../app/utils/GenericConfig';

export type UserGroup = UserGroupResponse;

export declare namespace UserGroupManagmentWidget {
    export type Params = unknown;

    export type Data = Stage.Types.PaginatedResponse<UserGroup>;

    export type Configuration = PollingTimeConfiguration & DataTableConfiguration;
}
