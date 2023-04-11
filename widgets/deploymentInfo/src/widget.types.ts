import type { PollingTimeConfiguration } from 'app/utils/GenericConfig';
import type { DeploymentWithUpdate } from 'app/widgets/common/deployments/DeploymentDetails';

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
        deployment: DeploymentWithUpdate;
        instancesCount: number;
        instancesStates: {
            [key: string]: number;
        };
    }
}
