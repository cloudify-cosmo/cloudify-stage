import { DeploymentStatus, DeploymentStatuses } from './types';

type GroupState = { name: string; icon: string; colorSUI: string; severity: number; description: string };

const groupStates: Record<DeploymentStatus, GroupState> = {
    [DeploymentStatuses.Good]: {
        name: 'good',
        icon: 'checkmark',
        colorSUI: 'green',
        severity: 1,
        description: ''
    },
    [DeploymentStatuses.InProgress]: {
        name: 'in progress',
        icon: 'spinner',
        colorSUI: 'yellow',
        severity: 2,
        description: ''
    },
    [DeploymentStatuses.RequiresAttention]: {
        name: 'failed',
        icon: 'close',
        colorSUI: 'red',
        severity: 4,
        description: ''
    }
};
export default groupStates;
