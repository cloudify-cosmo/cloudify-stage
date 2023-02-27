interface CapabilityBase {
    name: string;
    value: string;
}

export interface ExternalCapability extends CapabilityBase {
    source: 'input' | 'secret';
    blueprintDefault: boolean;
}

interface StaticCapability extends CapabilityBase {
    source: 'static';
}

export interface EnvironmentRenderParams {
    description: string;
    capabilities: (StaticCapability | ExternalCapability)[];
    labels: { key: string; value: string; blueprintDefault: boolean }[];
}
