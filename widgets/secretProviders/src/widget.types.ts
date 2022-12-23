import type { PollingTimeConfiguration, DataTableConfiguration } from '../../../app/utils/GenericConfig';

interface ConnectionParameters {
    host: string;
    token: string;
    path?: string;
}

export declare namespace SecretProvidersWidget {
    export type DataItem = {
        /* eslint-disable camelcase */
        created_at: Date | null;
        id: string;
        visibility: string;
        name: string;
        type: string;
        connection_parameters: ConnectionParameters | null;
        updated_at: Date | null;
        tenant_name: string;
        created_by: string;
        resource_availability: string;
        private_resource: boolean;
        /* eslint-enable camelcase */
    };

    export type Configuration = PollingTimeConfiguration & DataTableConfiguration;

    export type Data = Stage.Types.PaginatedResponse<DataItem>;

    export type DataSortingKeys = Pick<DataItem, 'name' | 'type' | 'created_at' | 'updated_at'>;
}

export enum SecretProvidersType {
    Vault = 'vault'
}
