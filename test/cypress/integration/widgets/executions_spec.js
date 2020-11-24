describe('Executions', () => {
    const blueprintName = 'executions_test';

    before(() => {
        cy.activate()
            .deleteDeployments(blueprintName, true)
            .deleteBlueprints(blueprintName, true)
            .deleteSites()
            .uploadBlueprint('blueprints/simple.zip', blueprintName, 'blueprint.yaml', 'global')
            .deployBlueprint(blueprintName, blueprintName, { server_ip: 'localhost' })
            .usePageMock('executions', { fieldsToShow: ['Status', 'Workflow'], pollingTime: 5 })
            .login()
            .executeWorkflow(blueprintName, 'install');

        cy.setDeploymentContext(blueprintName);
        cy.get('.executionsWidget tbody tr').should('have.length', 2);
    });

    describe('in table mode', () => {
        it('shows execution graph', () => {
            cy.get('.executionsWidget').contains('tr', 'failed').contains('install').click();

            cy.log('Check if Task Graph is visible');
            cy.get('.executionsWidget svg').should('be.visible');
        });

        it('provides message when there is no Task Execution Graph', () => {
            cy.get('.executionsWidget').contains('tr', 'create_deployment_environment').click();

            cy.log('Check if message is provided');
            cy.get('table.executionsTable').scrollIntoView();
            cy.get('table.executionsTable .message')
                .should('be.visible')
                .should('have.text', 'The selected execution does not have a tasks graph');
        });
    });

    describe('in single execution mode', () => {
        before(() =>
            cy.editWidgetConfiguration('executions', () => cy.get('input[name="singleExecutionView"]').parent().click())
        );

        it('displays tasks graph', () => {
            cy.get('.executionsWidget svg').should('be.visible');
        });

        it('displays Last Execution popup', () => {
            cy.log('Check if Task Graph is visible');
            cy.get('.executionsWidget svg').should('be.visible');

            cy.log('Check if Executions widget has Last Execution status icon');
            cy.get('.executionsWidget').contains('.ui.label', 'install failed').as('statusLabel');

            cy.get('@statusLabel').trigger('mouseover');
            cy.get('.popup .header').should('have.text', 'Last Execution');
            cy.get('@statusLabel').trigger('mouseout');
        });

        it('allows to start/stop focus mode', () => {
            cy.get('.play').click();
            cy.get('.play.green').click();
            cy.get('.play').should('not.have.class', 'green');
        });

        it('allows to fit graph to view', () => {
            cy.get('.executionsWidget svg > g')
                .invoke('attr', 'transform')
                .then(transformNotFit => {
                    cy.get('.expand.arrows.alternate').click();
                    cy.get('.executionsWidget svg > g').should('not.equal', transformNotFit);
                });
        });

        it('allows to display graph in modal window', () => {
            cy.get('.executions-graph-toolbar .expand:not(.arrows)').click();
            cy.get('.modal')
                .should('be.visible')
                .within(() => {
                    cy.get('div[role=navigation]').should('be.visible');
                });
        });
    });
});
