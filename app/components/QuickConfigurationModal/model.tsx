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
