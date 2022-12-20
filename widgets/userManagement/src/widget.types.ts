import type { UserResponse } from 'backend/handler/AuthHandler.types';
import type { DataTableConfiguration, PollingTimeConfiguration } from '../../../app/utils/GenericConfig';

export type User = UserResponse;

export declare namespace UserManagementWidget {
    export type Params = unknown;

    export type Configuration = PollingTimeConfiguration & DataTableConfiguration;

    export interface Data {
        /* eslint-disable camelcase */
        users: Stage.Types.PaginatedResponse<User>;
    }
}
