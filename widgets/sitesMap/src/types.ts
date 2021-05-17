export type DeploymentStates = Record<Stage.Common.DeploymentsView.Types.DeploymentStatus, number>;

export interface SitesMapWidgetParams {
    // eslint-disable-next-line camelcase
    blueprint_id: string | string[] | null;
    id?: string | string[] | null;
}

export type SitesMapWidgetData = Record<
    string,
    {
        name: string;
        latitude: number;
        longitude: number;
        deploymentStates: DeploymentStates;
    }
>;

export interface SitesMapWidgetConfiguration {
    pollingTime: number;
    showAllLabels: boolean;
}
