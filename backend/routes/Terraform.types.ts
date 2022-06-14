export interface Variable {
    variable: string;
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
    blueprintDescription: string;
    terraformVersion: string;
    terraformTemplate: string;
    urlAuthentication: boolean;
    resourceLocation: string;
    variables?: Variable[];
    environmentVariables?: Variable[];
    outputs?: Output[];
}

export interface RequestArchiveBody extends Omit<RequestBody, 'terraformTemplate'> {
    file?: string;
}

export interface RequestFetchDataBody {
    templateUrl: string;
    resourceLocation: string;
}
