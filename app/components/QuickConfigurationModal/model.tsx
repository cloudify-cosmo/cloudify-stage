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

export type JSONSchemaPlugin = {
    name: string;
    version?: RegExpString;
};

export type JSONSchemaSecret = {
    label: string;
    name: string;
    type: 'text' | 'password';
};

export type JSONSchemaItem = {
    name: string;
    logo: string;
    label: string;
    plugins: JSONSchemaPlugin[];
    secrets: JSONSchemaSecret[];
};

export type JSONSchema = JSONSchemaItem[];

export type TechnologiesData = Record<string, boolean | undefined>;
export type SecretData = Record<string, string | undefined>;
export type JSONData = Record<string, SecretData | undefined>;
