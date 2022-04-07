export const { DeploymentStatus } = Stage.Common.DeploymentsView.Types;

export type DeploymentStatus = typeof DeploymentStatus[keyof typeof DeploymentStatus];

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

export const DeploymentStatuses = DeploymentStatus;
