import type { PollingTimeConfiguration } from '../../../app/utils/GenericConfig';

export declare namespace DeploymentInfoWidget {
    export interface Params {
        // eslint-disable-next-line camelcase
        deployment_id?: string | string[] | null;
    }

    export interface Configuration extends PollingTimeConfiguration {
        showBlueprint: boolean;
        showSite: boolean;
        showCreated: boolean;
        showUpdated: boolean;
        showCreator: boolean;
        showNodeInstances: boolean;
    }

    export interface Data {
        /* eslint-disable camelcase */
        deployment: {
            id: string;
            display_name?: string;
            description: string;
            visibility: string;
            blueprint_id: string;
            site_name: string;
            created_at: string;
            updated_at: string;
            created_by: string;
            isUpdated: boolean;
        };
        /* eslint-enable camelcase */
        instancesCount: number;
        instancesStates: {
            [key: string]: number;
        };
    }
}
