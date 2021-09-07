// from REST API

export type PaginationResponse = {
    offset: number;
    size: number;
    total: number;
};

// used locally

export type RegExpString = string;

export enum StepName {
    Welcome,
    Environments,
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

export type GettingStartedSchemaBlueprint = {
    id: string;
    name: string;
    zipUrl: string;
    yamlFile?: string;
};

export type GettingStartedSchemaItem = {
    name: string;
    logo: string;
    label: string;
    plugins: GettingStartedSchemaPlugin[];
    secrets: GettingStartedSchemaSecret[];
    blueprints: GettingStartedSchemaBlueprint[];
};

export type GettingStartedSchema = GettingStartedSchemaItem[];

export type GettingStartedEnvironmentsData = Record<string, boolean | undefined>;
export type GettingStartedSecretsData = Record<string, string | undefined>;
export type GettingStartedData = Record<string, GettingStartedSecretsData | undefined>;
