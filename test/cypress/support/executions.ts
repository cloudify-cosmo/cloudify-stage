import { stringify } from 'query-string';
import type { GetCypressChainableFromCommands } from 'cloudify-ui-common-cypress/support';
import { addCommands } from 'cloudify-ui-common-cypress/support';
import type { WaitUntilOptions } from './resource_commons';

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
        cy.cfyRequest(`/executions/${executionId}`, 'POST', null, { action: 'kill', force: true }),

    killRunningExecutions: () => {
        const activeStatusesQueryString = stringify({
            status: ['scheduled', 'queued', 'pending', 'started', 'cancelling', 'force_cancelling']
        });
        const activeAndKillCancellingStatusesQueryString = `${activeStatusesQueryString}&status=kill_cancelling`;

        return cy
            .cfyRequest(`/executions?${activeStatusesQueryString}`, 'GET')
            .then(response => response.body.items.forEach(({ id }: { id: string }) => cy.killExecution(id)))
            .then(() => cy.waitUntilEmpty(`executions?${activeAndKillCancellingStatusesQueryString}`));
    },

    waitForExecutionToEnd: (
        workflowId: string,
        options: { deploymentId?: string; deploymentDisplayName?: string; expectedStatus?: string } = {},
        waitOptions?: WaitUntilOptions
    ) => {
        const { deploymentId, deploymentDisplayName, expectedStatus = 'completed' } = options;

        let deploymentExecutionsUrl = `executions?_include=id,status_display,workflow_id,ended_at&workflow_id=${workflowId}`;
        if (deploymentId) deploymentExecutionsUrl += `&deployment_id=${deploymentId}`;
        if (deploymentDisplayName) deploymentExecutionsUrl += `&deployment_display_name=${deploymentDisplayName}`;

        cy.log(`Waiting for workflow ${workflowId} on deployment ${deploymentId} to be ended.`);
        cy.waitUntil(
            deploymentExecutionsUrl,
            response => _.find(response.body.items, item => item.ended_at),
            waitOptions
        );

        cy.log(`Checking if workflow ${workflowId} on deployment ${deploymentId} has status ${expectedStatus}.`);
        return cy.cfyRequest(`/${deploymentExecutionsUrl}`).then(response => {
            const status = response.body.items[0].status_display;
            expect(status).to.equal(expectedStatus);
        });
    }
};

addCommands(commands);
