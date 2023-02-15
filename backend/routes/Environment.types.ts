interface CapabilityBase {
    name: string;
    value: string;
}

export interface ExternallCapability extends CapabilityBase {
    source: 'input' | 'secret';
    blueprintDefault: boolean;
}

export interface PostEnvironmentBlueprintRequestBody {
    description: string;
    capabilities: ((CapabilityBase & { source: 'static' }) | ExternallCapability)[];
    labels: { key: string; value: string; blueprintDefault: boolean }[];
}

export type PostEnvironmentBlueprintResponse = string;
