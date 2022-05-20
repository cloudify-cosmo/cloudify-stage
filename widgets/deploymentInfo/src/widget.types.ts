export declare namespace DeploymentInfoWidget {
    export interface Configuration {
        showExpiredTokens: boolean;
        pollingTime: number;
    }

    export interface Data {
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
