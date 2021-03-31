// from REST API

export type PaginationResponse = {
    offset: number;
    size: number;
    total: number;
};

export type MetadataResponse = {
    pagination: PaginationResponse;
    filtered: unknown;
};

// used locally

export type RegExpString = string;

export enum StepName {
    Technologies,
    Secrets,
    Summary,
    Status
}

export type GettingStartedSchemaPlugin = {
    name: string;
    version?: RegExpString;
};

export type GettingStartedSchemaSecret = {
    label: string;
    name: string;
    type: 'text' | 'password';
};

export type GettingStartedSchemaItem = {
    name: string;
    logo: string;
    label: string;
    plugins: GettingStartedSchemaPlugin[];
    secrets: GettingStartedSchemaSecret[];
};

export type GettingStartedSchema = GettingStartedSchemaItem[];

export type GettingStartedTechnologiesData = Record<string, boolean | undefined>;
export type GettingStartedSecretsData = Record<string, string | undefined>;
export type GettingStartedData = Record<string, GettingStartedSecretsData | undefined>;
