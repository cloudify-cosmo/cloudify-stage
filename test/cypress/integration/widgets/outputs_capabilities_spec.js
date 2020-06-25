import _ from 'lodash';

describe('Outputs/Capabilities', () => {
    const blueprintName = 'outputs_capabilities_test';
    const deploymentName = 'outputs_capabilities_test';

    before(() => cy.activate('valid_trial_license').login());

    describe('presents data and export button', () => {
        before(() => {
            cy.deleteDeployments(deploymentName, true)
                .deleteBlueprints(blueprintName, true)
                .uploadBlueprint('blueprints/outputs.zip', blueprintName);
        });

        function checkTable() {
            cy.get('div.outputsTable').within(() => {
                cy.contains('Type').click();
                cy.get('tr:eq(1) td:eq(1)').should('have.text', 'Capability');
                cy.get('tr:eq(2) td:eq(1)').should('have.text', 'Capability');
                cy.get('tr:eq(3) td:eq(1)').should('have.text', 'Capability');
                cy.get('tr:eq(4) td:eq(1)').should('have.text', 'Output');
                cy.get('tr:eq(5) td:eq(1)').should('have.text', 'Output');
                cy.contains('Type').click();
                cy.get('tr:eq(1) td:eq(1)').should('have.text', 'Output');
                cy.get('tr:eq(2) td:eq(1)').should('have.text', 'Output');
                cy.get('tr:eq(3) td:eq(1)').should('have.text', 'Capability');
                cy.get('tr:eq(4) td:eq(1)').should('have.text', 'Capability');
                cy.get('tr:eq(5) td:eq(1)').should('have.text', 'Capability');

                cy.contains('Export to JSON');
            });
        }

        it('in Blueprint page', () => {
            cy.log('Navigate to Local Blueprints page');
            cy.get('.local_blueprintsPageMenuItem').click();

            cy.log('Go into Blueprint page');
            cy.get(`#blueprintsTable_${blueprintName} > td > .blueprintName`).click();

            checkTable();
        });

        it('in Deployment page', () => {
            cy.deployBlueprint(blueprintName, deploymentName);

            cy.log('Navigate to Deployments page');
            cy.get('.deploymentsPageMenuItem').click();

            cy.log('Go into Deployment page');
            cy.get(`.ui.segment.${deploymentName} > .ui > .row`).click();

            checkTable();
        });
    });

    it('hides export button when no data is available', () => {
        cy.deleteDeployments(deploymentName, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/empty.zip', blueprintName);

        cy.log('Navigate to Local Blueprints page');
        cy.get('.local_blueprintsPageMenuItem').click();

        cy.log('Go into Blueprint page');
        cy.get(`#blueprintsTable_${blueprintName} > td > .blueprintName`).click();

        cy.contains('Export to JSON').should('not.exist');
    });
});
