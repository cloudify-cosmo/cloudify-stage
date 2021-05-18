import { DeploymentStatus, DeploymentStatuses } from './types';

type GroupState = { name: string; icon: string; colorSUI: string; severity: number; description: string };

const groupStates: Record<DeploymentStatus, GroupState> = {
    [DeploymentStatuses.Good]: {
        name: 'good',
        icon: 'checkmark',
        colorSUI: 'green',
        severity: 1,
        description: 'deployments with all nodes in active state, and a successful last workflow execution'
    },
    [DeploymentStatuses.InProgress]: {
        name: 'in progress',
        icon: 'spinner',
        colorSUI: 'orange',
        severity: 2,
        description: 'deployments in which active workflow execution is performed'
    },
    [DeploymentStatuses.RequiresAttention]: {
        name: 'failed',
        icon: 'exclamation',
        colorSUI: 'red',
        severity: 4,
        description: 'deployments with inactive nodes or a failed last workflow execution'
    }
};
export default groupStates;
