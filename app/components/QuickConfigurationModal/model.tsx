export type JSONSchemaSecret = {
    label: string;
    name: string;
    type: 'text' | 'password';
};

export type JSONSchemaItem = {
    name: string;
    logo: string;
    label: string;
    plugins: string[];
    secrets: JSONSchemaSecret[];
};

export type JSONSchema = JSONSchemaItem[];

export type TechnologiesData = Record<string, boolean | undefined>;
export type SecretData = Record<string, string | undefined>;
export type JSONData = Record<string, SecretData | undefined>;
