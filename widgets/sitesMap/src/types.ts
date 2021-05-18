export type DeploymentStatus = Stage.Common.DeploymentsView.Types.DeploymentStatus;

export type DeploymentStatusesSummary = Record<DeploymentStatus, number>;

export type SitesData = Record<
    string,
    {
        name: string;
        latitude: number;
        longitude: number;
        statusesSummary: DeploymentStatusesSummary;
    }
>;

const { DeploymentStatus } = Stage.Common.DeploymentsView.Types;
export const DeploymentStatuses = DeploymentStatus;
