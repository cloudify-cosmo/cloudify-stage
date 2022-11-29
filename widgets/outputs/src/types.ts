import type { PollingTimeConfiguration } from '../../../app/utils/GenericConfig';

export interface OutputsAndCapabilitiesItem {
    description: string;
    isOutput: boolean;
    name: string;
    value: unknown;
}

export type OutputsTableConfiguration = PollingTimeConfiguration & { showCapabilities: boolean };
