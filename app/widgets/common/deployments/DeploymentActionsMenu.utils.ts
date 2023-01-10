import type { Label } from '../labels/types';
import type { Workflow } from '../executeWorkflow';
import type { MenuItem } from './DeploymentActionsMenu.consts';
import { permissions, actions } from './DeploymentActionsMenu.consts';

function isDeployOnFunctionalityAvailable(deploymentLabels: Label[]) {
    return deploymentLabels.some(deploymentLabel => {
        return deploymentLabel.key === 'csys-obj-type' && deploymentLabel.value === 'environment';
    });
}

export function isMenuItemAvailable(item: MenuItem, workflows: Workflow[], deploymentLabels: Label[]) {
    if (item.permission === permissions.executeWorkflow) {
        const workflow = workflows?.find(w => w.name === item.name);
        return !!workflow?.is_available;
    }

    if (item.name === actions.deployOn) {
        return isDeployOnFunctionalityAvailable(deploymentLabels);
    }

    return true;
}
