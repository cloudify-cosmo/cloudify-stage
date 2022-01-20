export interface Variable {
    name: string;
    source: 'input' | 'secret' | 'static';
    value: string;
}

export interface Output {
    name: string;
    type: 'output' | 'capability';
    terraformOutput: string;
}

export interface RequestBody {
    blueprintName: string;
    terraformVersion: string;
    terraformTemplate: string;
    urlAuthentication: boolean;
    resourceLocation: string;
    variables?: Variable[];
    environmentVariables?: Variable[];
    outputs?: Output[];
}
