import { find } from 'lodash';
import type { Deployment } from './types';

interface SelectedDeploymentResult {
    selectedDeployment: Deployment | undefined;
    fallbackDeployment: Deployment | undefined;
}

const getSelectedDeployment = (
    deploymentIdInContext: Stage.ContextEntries['deploymentId'] | undefined,
    deployments: Deployment[]
): SelectedDeploymentResult => {
    const fallbackDeployment: Deployment | undefined = deployments[0];

    if (Array.isArray(deploymentIdInContext)) {
        if (deploymentIdInContext.length === 1) {
            // NOTE: try to work nicely if there is a singleton array
            return getSelectedDeployment(deploymentIdInContext[0], deployments);
        }

        log.warn(
            'The Deployments View widget does not support selecting multiple deployments. ' +
                'Most likely you are using a Resource Filter widget alongside it and the combination is not supported'
        );

        return {
            selectedDeployment: undefined,
            fallbackDeployment
        };
    }

    const selectedDeployment = find(deployments, {
        id: deploymentIdInContext as string | undefined
    });

    return {
        selectedDeployment,
        fallbackDeployment
    };
};

export default getSelectedDeployment;
