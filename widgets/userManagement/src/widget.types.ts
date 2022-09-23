import type { PollingTimeConfiguration, DataTableConfiguration } from '../../../app/utils/GenericConfig';
import type { UserResponse } from '../../../backend/routes/Auth.types';

export type User = UserResponse;

export declare namespace UserManagementWidget {
    export type Params = unknown;

    export type Configuration = PollingTimeConfiguration & DataTableConfiguration;

    export interface Data {
        /* eslint-disable camelcase */
        users: Stage.Types.PaginatedResponse<User>;
    }
}
