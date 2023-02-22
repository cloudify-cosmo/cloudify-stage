export interface Variable {
    variable: string;
    name: string;
    source: 'input' | 'secret' | 'static';
    value: string;
    duplicated: boolean;
}

export interface Output {
    name: string;
    type: 'output' | 'capability';
    terraformOutput: string;
}

export interface TerraformBlueprintData {
    blueprintName: string;
    blueprintDescription: string;
    terraformVersion: string;
    terraformTemplate: string;
    urlAuthentication: boolean;
    resourceLocation: string;
    variables?: Variable[];
    environmentVariables?: Variable[];
    outputs?: Output[];
}

interface TerraformParserOutputDefinition {
    name: string;
    pos: { filename: string; line: number };
}
interface TerraformParserVariableDefinition extends TerraformParserOutputDefinition {
    default: any;
    description?: string;
    required: boolean;
    type: string;
}
export interface TerraformParserResult {
    outputs: Record<string, TerraformParserOutputDefinition>;
    variables: Record<string, TerraformParserVariableDefinition>;

    /* eslint-disable camelcase */
    data_resources: any;
    managed_resources: any;
    module_calls: any;
    provider_configs: any;
    required_providers: any;
    /* eslint-enable camelcase */
}
