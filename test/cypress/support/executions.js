Cypress.Commands.add('getExecutions', (filter = '') => {
    cy.cfyRequest(`/executions${filter ? `?${filter}` : ''}`, 'GET');
});

// NOTE: This function was not tested. Remove this comment once tested and used in test cases.
Cypress.Commands.add('executeWorkflow', (deploymentId, workflowId, parameters = {}, force = false) => {
    cy.cfyRequest('/executions', 'POST', null, {
        deployment_id: deploymentId,
        workflow_id: workflowId,
        parameters,
        force
    });
});

// NOTE: This function was not tested. Remove this comment once tested and used in test cases.
Cypress.Commands.add('cancelExecution', (executionId, deploymentId, action = 'force-cancel') => {
    cy.cfyRequest(`/executions/${executionId}`, 'POST', null, {
        deployment_id: deploymentId,
        action
    });
});
