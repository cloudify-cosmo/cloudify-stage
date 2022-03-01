import { stringify } from 'query-string';
import { addCommands, GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';
import { waitUntil, waitUntilEmpty, WaitUntilOptions } from './resource_commons';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const commands = {
    getExecutions: (filter = '') => cy.cfyRequest(`/executions${filter ? `?${filter}` : ''}`, 'GET'),

    executeWorkflow: (deploymentId: string, workflowId: string, parameters = {}, force = false) =>
        cy.cfyRequest('/executions', 'POST', null, {
            deployment_id: deploymentId,
            workflow_id: workflowId,
            parameters,
            force
        }),

    killExecution: (executionId: string) =>
        cy.cfyRequest(`/executions/${executionId}`, 'POST', null, { action: 'kill' }),

    killRunningExecutions: () => {
        const activeExecutionsUrl = `/executions?${stringify({
            status: ['scheduled', 'queued', 'pending', 'started', 'cancelling', 'force_cancelling']
        })}`;

        const activeAndKillCancellingExecutionsUrl = `${activeExecutionsUrl}&${stringify({
            status: ['kill_cancelling']
        })}`;

        return cy
            .cfyRequest(activeExecutionsUrl, 'GET')
            .then(response => response.body.items.forEach(({ id }: { id: string }) => cy.killExecution(id)))
            .then(() => waitUntilEmpty(activeAndKillCancellingExecutionsUrl));
    },

    waitForExecutionToEnd: (
        workflowId: string,
        options: { deploymentId?: string; deploymentDisplayName?: string } = {},
        waitOptions?: WaitUntilOptions
    ) => {
        const { deploymentId, deploymentDisplayName } = options;

        let deploymentExecutionsUrl = `executions?_include=id,workflow_id,ended_at&workflow_id=${workflowId}`;
        if (deploymentId) deploymentExecutionsUrl += `&deployment_id=${deploymentId}`;
        if (deploymentDisplayName) deploymentExecutionsUrl += `&deployment_display_name=${deploymentDisplayName}`;

        cy.log(`Waiting for workflow ${workflowId} on deployment ${deploymentId} to be ended.`);
        return waitUntil(
            deploymentExecutionsUrl,
            response => _.find(response.body.items, item => item.ended_at),
            waitOptions
        );
    }
};

addCommands(commands);
