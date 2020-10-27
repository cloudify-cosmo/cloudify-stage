describe('Executions', () => {
    const blueprintName = 'executions_test';

    before(() => {
        cy.activate()
            .deleteDeployments(blueprintName, true)
            .deleteBlueprints(blueprintName, true)
            .deleteSites()
            .uploadBlueprint('blueprints/simple.zip', blueprintName, 'blueprint.yaml', 'global')
            .deployBlueprint(blueprintName, blueprintName, { server_ip: 'localhost' })
            .login()
            .executeWorkflow(blueprintName, 'install');

        cy.contains('Deployments').click();
        cy.get('.deploymentsWidget').contains(blueprintName).click();
    });

    it('works in table mode', () => {
        cy.get('.tabular.menu').contains('a.item', 'History').click();

        cy.log('Check if Executions widget has table rows');
        cy.get('.executionsWidget').contains('tr', 'failed').contains('install').click();

        cy.log('Check if Task Graph is visible');
        cy.get('.executionsWidget svg').should('be.visible');
    });

    it('works in single execution mode', () => {
        cy.get('.tabular.menu').contains('a.item', 'Last Execution').click();

        cy.log('Check if Task Graph is visible');
        cy.get('.executionsWidget svg').should('be.visible');

        cy.log('Check if Executions widget has Last Execution status icon');
        cy.get('.executionsWidget').contains('.ui.label', 'install failed').as('statusLabel');

        cy.get('@statusLabel').trigger('mouseover');
        cy.get('.popup .header').should('have.text', 'Last Execution');
        cy.get('@statusLabel').trigger('mouseout');
    });

    it('provides message when there is no Task Execution Graph', () => {
        cy.get('.tabular.menu').contains('a.item', 'History').click();

        cy.log('Check if Executions widget has table rows');
        cy.get('.executionsWidget').contains('tr', 'create_deployment_environment').click();

        cy.log('Check if message is provided');
        cy.get('table.executionsTable').scrollIntoView();
        cy.get('table.executionsTable .message')
            .should('be.visible')
            .should('have.text', 'The selected execution does not have a tasks graph');
    });

    describe('provides Task Execution Graph', () => {
        before(() => {
            cy.get('.tabular.menu').contains('a.item', 'Last Execution').click();
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
