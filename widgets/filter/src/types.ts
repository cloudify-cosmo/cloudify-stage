import type { PollingTimeConfiguration } from 'app/utils/GenericConfig';

export interface FilterConfiguration extends PollingTimeConfiguration {
    filterByBlueprints: boolean;
    filterByDeployments: boolean;
    filterByExecutions: boolean;
    filterByNodes: boolean;
    filterByNodeInstances: boolean;
    filterByExecutionsStatus: boolean;
    filterBySiteName: boolean;
    allowMultipleSelection: boolean;
}
