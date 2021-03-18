// from REST API

export type PaginationData = {
    offset: number;
    size: number;
    total: number;
};

export type PageMetadataData = {
    pagination: PaginationData;
    filtered: unknown;
};

// used locally

export type RegExpString = string;

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
    description: string;
    htmlUrl: string;
    zipUrl: string;
    readmeUrl: string;
    mainBlueprint?: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
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

export type GettingStartedTechnologiesData = Record<string, boolean | undefined>;
export type GettingStartedSecretsData = Record<string, string | undefined>;
export type GettingStartedData = Record<string, GettingStartedSecretsData | undefined>;
