export interface EnvironmentRenderParams {
    description: string;
    inputs: Record<string, null | { defaultSource: 'static' | 'secret'; defaultValue: string }>;
    labels: Record<string, string>;
    capabilities: Record<string, { source: 'static' | 'input'; value: string }>;
}
