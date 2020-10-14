import _ from 'lodash';

describe('Deployments widget', () => {
    const blueprintName = 'deployments_test_hw';
    const deploymentName = 'deployments_test_hw_dep';
    const siteName = 'Zakopane';
    const site = { name: siteName };
    const blueprintUrl =
        'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/simple-hello-world-example.zip';

    const searchForDeployment = name =>
        cy.get('.deploymentsWidget').within(() => {
            cy.get('.input input')
                .clear()
                .type(name);
            cy.get('.input.loading').should('be.not.visible');
        });

    const actOnDeployment = (name, action) => {
        searchForDeployment(name);
        cy.contains('div.row', name)
            .find('.menuAction')
            .click();
        cy.get('.popupMenu > .menu')
            .contains(action)
            .click();
    };

    before(() => {
        cy.activate('valid_trial_license')
            .deleteSites(siteName)
            .deleteDeployments(deploymentName, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint(blueprintUrl, blueprintName)
            .deployBlueprint(blueprintName, deploymentName, { webserver_port: 9123 })
            .createSite(site)
            .login()
            .visitPage('Deployments')
            .editWidgetConfiguration('deployments', () => {
                cy.get('input[name="pollingTime"]')
                    .clear()
                    .type(_.repeat('{uparrow}', 5));
            });
    });

    it('should be present in Deployments page', () => {
        cy.visitPage('Deployments');
        searchForDeployment(deploymentName);
        cy.get('.deploymentSegment h3').should('have.text', deploymentName);
    });

    describe('should provide display configuration', () => {
        before(() => {
            cy.addPage('Deployments Test').addWidget('deployments');
        });

        /*
        Default configuration
        - clickToDrillDown = true
        - showExecutionStatusLabel = false
        - blueprintIdFilter = ''
        - displayStyle = List
        */

        it('to change clickToDrillDown option', () => {
            cy.contains(deploymentName).click();
            cy.location('pathname').should('contain', '_deployment/deployments_test_hw_dep');
            cy.get('.breadcrumb').should('have.text', 'Deployments Testdeployments_test_hw_dep');

            cy.visitPage('Deployments Test');
            cy.editWidgetConfiguration('deployments', () => {
                cy.get('input[name="clickToDrillDown"]')
                    .parent()
                    .click();
            });

            cy.contains(deploymentName).click();
            cy.location('pathname').should('not.contain', '_deployment/deployments_test_hw_dep');
            cy.get('.breadcrumb').should('have.text', 'Deployments Test');
        });

        it('to change showExecutionStatusLabel option', () => {
            cy.visitPage('Deployments Test');
            searchForDeployment(deploymentName);

            const lastExecutionCellSelector = 'tr#deploymentsTable_deployments_test_hw_dep td:nth-child(2)';
            cy.get(lastExecutionCellSelector).within(() => {
                cy.get('.icon').should('be.visible');
                cy.get('.label').should('not.be.visible');
            });

            cy.editWidgetConfiguration('deployments', () => {
                cy.get('input[name="showExecutionStatusLabel"]')
                    .parent()
                    .click();
            });

            searchForDeployment(deploymentName);
            cy.get(lastExecutionCellSelector).within(() => {
                cy.get('.icon').should('be.visible');
                cy.get('.label').should('be.visible');
            });
        });

        it('to change blueprintIdFilter option', () => {
            cy.server();
            cy.route('GET', `**/deployments*blueprint_id=${blueprintName}`).as('getFilteredDeployments');

            cy.visitPage('Deployments Test');

            cy.editWidgetConfiguration('deployments', () => {
                cy.get('input[name="blueprintIdFilter"]')
                    .clear()
                    .type(blueprintName);
            });

            cy.wait('@getFilteredDeployments');
        });

        it('to change displayStyle option', () => {
            cy.visitPage('Deployments Test');

            cy.get('table.deploymentsTable').should('be.visible');
            cy.get('div.segmentList').should('not.be.visible');

            cy.editWidgetConfiguration('deployments', () => {
                cy.get('div[name="displayStyle"]').click();
                cy.get('div[option-value="list"]').click();
            });

            cy.get('table.deploymentsTable').should('not.be.visible');
            cy.get('div.segmentList').should('be.visible');
        });
    });

    it('should allow to execute workflow', () => {
        cy.server();
        cy.route('POST', `**/executions`).as('executeWorkflow');

        cy.visitPage('Deployments');
        actOnDeployment(deploymentName, 'Install');

        cy.get('.executeWorkflowModal button.ok').click();

        cy.wait('@executeWorkflow');
        cy.contains('div.row', deploymentName)
            .find('.spinner.loading.icon')
            .should('be.visible');
    });

    it('should allow to set site for deployment', () => {
        cy.server();
        cy.route('POST', `**/deployments/${deploymentName}/set-site`).as('setDeploymentSite');

        cy.visitPage('Deployments');
        actOnDeployment(deploymentName, 'Set Site');

        cy.get('.modal').within(() => {
            cy.get('div[name="siteName"]').click();
            cy.get(`div[option-value="${siteName}"]`).click();
            cy.get('button.ok').click();
        });

        cy.wait('@setDeploymentSite');
        cy.contains('div.row', deploymentName)
            .find('div.column:nth-child(2) h5:nth-child(2) .sub.header')
            .should('have.text', siteName);
    });

    it('should allow to update deployment', () => {
        cy.server();
        cy.route('PUT', `**/deployment-updates/${deploymentName}/update/initiate`).as('updateDeployment');

        cy.visitPage('Deployments');
        actOnDeployment(deploymentName, 'Update');

        cy.get('.updateDeploymentModal').within(() => {
            cy.get('textarea[name="webserver_port"]')
                .clear()
                .type('9321');
            cy.get('button.blue.ok').click();
        });

        cy.get('.updateDetailsModal').within(() => {
            cy.contains('tr', 'webserver_port').within(() => {
                cy.get('td:nth-child(2)').should('have.text', '9123');
                cy.get('td:nth-child(3)').should('have.text', '9321');
            });
            cy.get('button.ok').click();
        });

        cy.wait('@updateDeployment');
        cy.get('.updateDetailsModal').should('be.not.visible');

        cy.contains('div.row', deploymentName).within(() => {
            const updateTimeout = 30000;
            cy.get('div.column:nth-child(1) .spinner.loading.icon').should('be.visible');
            cy.get('div.column:nth-child(1) .green.checkmark.icon', { timeout: updateTimeout }).should('be.visible');
            cy.get('div.column:nth-child(3) h5:nth-child(2)').should('contain.text', 'Updated');
        });
    });

    it('should allow to remove deployment', () => {
        const testDeploymentName = `${deploymentName}_remove`;
        cy.deployBlueprint(blueprintName, testDeploymentName);
        cy.server();
        cy.route('DELETE', `**/deployments/${testDeploymentName}?force=true`).as('deleteDeployment');

        cy.visitPage('Deployments');
        actOnDeployment(testDeploymentName, 'Force Delete');

        cy.get('.modal button.primary').click();

        cy.wait('@deleteDeployment');
        cy.contains('div.row', testDeploymentName).should('not.be.visible');
    });
});
