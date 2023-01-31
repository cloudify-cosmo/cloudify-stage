import type { Secret } from 'app/widgets/common/secrets/SecretActions';
import type { DataTableConfiguration, PollingTimeConfiguration } from '../../../app/utils/GenericConfig';

export declare namespace SecretsWidget {
    export type Data = Stage.Types.PaginatedResponse<Secret>;

    export type Configuration = PollingTimeConfiguration & DataTableConfiguration;
}
