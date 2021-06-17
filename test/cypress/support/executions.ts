import { addCommands, GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';
import { waitUntilEmpty } from './resource_commons';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const getPlannedOrStartedExecutionsUrl = (deploymentId: string) =>
    `/executions?deployment_id=${deploymentId}&status=scheduled&status=queued&status=pending&status=started`;

const commands = {
    getExecutions: (filter = '') => {
        cy.cfyRequest(`/executions${filter ? `?${filter}` : ''}`, 'GET');
    },

    executeWorkflow: (deploymentId: string, workflowId: string, parameters = {}, force = false) => {
        cy.cfyRequest('/executions', 'POST', null, {
            deployment_id: deploymentId,
            workflow_id: workflowId,
            parameters,
            force
        });
    },

    killExecution: (executionId: string) => {
        cy.cfyRequest(`/executions/${executionId}`, 'POST', null, { action: 'kill' });
    },

    killExecutions: (deploymentId: string) => {
        cy.cfyRequest(getPlannedOrStartedExecutionsUrl(deploymentId), 'GET')
            .then(response => response.body.items.forEach(({ id }: { id: string }) => cy.killExecution(id)))
            .then(() => cy.waitUntilNoExecutionIsActive(deploymentId));
    },

    waitUntilNoExecutionIsActive: (deploymentId: string) => {
        const activeExecutionsUrl = `${getPlannedOrStartedExecutionsUrl(
            deploymentId
        )}&status=cancelling&status=force_cancelling&status=kill_cancelling`;
        waitUntilEmpty(activeExecutionsUrl);
    }
};

addCommands(commands);
