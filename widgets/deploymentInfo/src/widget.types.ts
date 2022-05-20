export declare namespace DeploymentInfoWidget {
    export interface Params {
        deployment_id?: string | string[] | null;
    }

    export interface Configuration {
        pollingTime: number;
        showBlueprint: boolean;
        showSite: boolean;
        showCreated: boolean;
        showUpdated: boolean;
        showCreator: boolean;
        showNodeInstances: boolean;
    }

    export interface Data {
        // TODO: Ensure that the typing is accurate, with the core team
        deployment: {
            id: string;
            display_name?: string;
            visibility: string;
            blueprint_id?: string;
            description?: string;
            site_name?: string;
            created_at?: string;
            updated_at?: string;
            created_by?: string;
            isUpdated?: boolean;
        };
        instancesCount: number;
        instancesStates: {
            [key: string]: number;
        };
    }
}
