describe('Outputs/Capabilities', () => {
    const blueprintName = 'outputs_capabilities_test';
    const deploymentName = 'outputs_capabilities_test';

    before(() => cy.activate('valid_trial_license').usePageMock('outputs', { showCapabilities: true }).login());

    function setUpBlueprint(blueprintPackage) {
        cy.deleteDeployments(deploymentName, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint(`blueprints/${blueprintPackage}.zip`, blueprintName);
    }

    it('hides export button when no data is available', () => {
        setUpBlueprint('empty');

        cy.setBlueprintContext(blueprintName);

        cy.contains('Export to JSON').should('not.exist');
    });

    describe('presents data and export button for', () => {
        before(() => {
            setUpBlueprint('outputs');
            cy.refreshTemplate();
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

        it('blueprint', () => {
            cy.setBlueprintContext(blueprintName);
            checkTable();
        });

        it('deployment', () => {
            cy.deployBlueprint(blueprintName, deploymentName);
            cy.setDeploymentContext(deploymentName);
            checkTable();
        });
    });
});
