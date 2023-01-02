import type { Visibility } from 'app/widgets/common/types';
import type { DataTableConfiguration, PollingTimeConfiguration } from '../../../app/utils/GenericConfig';

/* eslint-disable camelcase */
export type Secret = {
    created_at?: string;
    created_by?: string;
    is_hidden_value?: boolean;
    key: string;
    resource_availability?: string;
    tenant_name?: string;
    updated_at?: string;
    visibility?: Visibility;
};
/* eslint-enable camelcase */

export declare namespace SecretsWidget {
    export type Data = Stage.Types.PaginatedResponse<Secret>;

    export type Configuration = PollingTimeConfiguration & DataTableConfiguration;
}
