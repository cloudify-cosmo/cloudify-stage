import type { PollingTimeConfiguration, DataTableConfiguration } from '../../../app/utils/GenericConfig';
import type { UserGroupResponse } from '../../../backend/handler/AuthHandler.types';

export type UserGroup = UserGroupResponse;

export declare namespace UserGroupManagmentWidget {
    export type Params = unknown;

    export type Data = Stage.Types.PaginatedResponse<UserGroup>;

    export interface Configuration extends PollingTimeConfiguration, DataTableConfiguration {
        isLdapEnabled: boolean;
    }
}
