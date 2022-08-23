describe('Executions', () => {
    const widgetId = 'executions';
    const blueprintName = 'executions_test';

    before(() => {
        cy.activate()
            .deleteDeployments(blueprintName, true)
            .deleteBlueprints(blueprintName, true)
            .deleteSites()
            .uploadBlueprint('blueprints/simple.zip', blueprintName, { visibility: 'global' })
            .deployBlueprint(blueprintName, blueprintName, { server_ip: 'localhost' })
            .usePageMock(widgetId, {
                fieldsToShow: ['Deployment', 'Deployment ID', 'Status', 'Workflow'],
                pollingTime: 5
            })
            .mockLogin()
            .executeWorkflow(blueprintName, 'install');

        cy.setDeploymentContext(blueprintName);
        cy.getWidget(widgetId).find('tbody tr').should('have.length', 2);
    });

    describe('in table mode', () => {
        it('allows showing the deployment display name', () => {
            cy.log('Check if display name is provided');
            cy.getWidget(widgetId)
                .find('table')
                .getTable()
                .should(tableData => {
                    expect(tableData).to.have.length(2);
                    expect(tableData[0].Deployment).to.eq('executions_test');
                });
        });

        it('shows execution graph', () => {
            cy.getWidget(widgetId).contains('tr', 'failed').contains('install').click();

            cy.log('Check if Task Graph is visible');
            cy.getWidget(widgetId).find('svg').should('be.visible');
        });

        it('provides message when there is no Task Execution Graph', () => {
            cy.getWidget(widgetId).contains('tr', 'create_deployment_environment').click();

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
            cy.getWidget(widgetId).find('svg').should('be.visible');
        });

        it('displays Last Execution popup', () => {
            cy.log('Check if Task Graph is visible');
            cy.getWidget(widgetId).find('svg').should('be.visible');

            cy.log('Check if Executions widget has Last Execution status icon');
            cy.getWidget(widgetId).contains('.ui.label', 'install failed').as('statusLabel');

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
            cy.getWidget(widgetId)
                .find('svg > g')
                .invoke('attr', 'transform')
                .then(transformNotFit => {
                    cy.get('.expand.arrows.alternate').click();
                    cy.getWidget(widgetId).find('svg > g').should('not.equal', transformNotFit);
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
