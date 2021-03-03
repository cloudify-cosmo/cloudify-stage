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

export type TechnologyData = Record<string, boolean>;
export type SecretData = Record<string, string>;
export type JSONData = Record<string, SecretData>;
