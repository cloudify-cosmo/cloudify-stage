describe('Filter', () => {
    before(() => {
        cy.activate('valid_trial_license')
            .deleteAllUsersAndTenants()
            .usePageMock(['blueprints', 'deployments'])
            .login();
    });

    it('fills dropdowns with correct data', () => {
        cy.server();
        cy.route(/console\/sp\?su=\/blueprints/, 'fixture:filter/blueprints.json');
        cy.route(/console\/sp\?su=\/deployments.*offset=0/, 'fixture:filter/deployments0.json');
        cy.route(/console\/sp\?su=\/deployments.*offset=20/, 'fixture:filter/deployments1.json');
        cy.route(/console\/sp\?su=\/executions/, 'fixture:filter/executions.json');

        cy.get('#dynamicDropdown1').click();
        cy.contains('app2.2-clickme').click();
        cy.get('#dynamicDropdown1 > .label').should('have.length', 1);

        cy.get('#dynamicDropdown2').click();
        cy.get('#dynamicDropdown2 .menu > *:eq(0)').should('have.text', 'app2.2');
        cy.get('#dynamicDropdown2 .menu > *:eq(1)').should('have.text', 'uuu');
        cy.get('#dynamicDropdown2 .menu > *').should('have.length', 2);
        cy.contains('uuu').click();
        cy.get('#dynamicDropdown2 > .label').should('have.length', 1);

        cy.get('#dynamicDropdown3').click();
        cy.get('#dynamicDropdown3 .menu > *').should('have.text', 'uuustatus').should('have.length', 1).click();
        cy.get('#dynamicDropdown3 > .label').should('have.length', 1);

        cy.get('#dynamicDropdown1 > .label .delete').click();
        cy.get('#dynamicDropdown1 > .label').should('have.length', 0);

        cy.get('#dynamicDropdown2 > .label').should('have.length', 0);
        cy.get('#dynamicDropdown2').click();
        cy.get('#dynamicDropdown2 .menu > *').should('have.length', 24);

        cy.get('#dynamicDropdown3 > .label').should('have.length', 1);
        cy.get('#dynamicDropdown3').click();
        cy.get('#dynamicDropdown3 .menu > *').should('have.length', 2);
    });

    describe('refreshes dropdown data on', () => {
        const blueprintName = 'filter-test';

        before(() =>
            cy
                .deleteDeployments(blueprintName)
                .deleteBlueprints(blueprintName)
                .uploadBlueprint('blueprints/empty.zip', blueprintName)
                .setBlueprintContext(blueprintName)
        );

        it('deployment creation and removal', () => {
            cy.get('.blueprintsWidget input[placeholder^=Search]').clear().type(blueprintName);
            cy.get(`.blueprintsWidget .${blueprintName}`).parent().find('.rocket').click();
            const deploymentName = `${blueprintName}-deployment`;
            cy.get('input[name=deploymentName]').type(deploymentName);
            cy.contains('Runtime only evaluation').click();
            cy.contains('.modal button', 'Deploy').click();

            cy.get('.modal').should('not.exist');
            cy.refreshPage();

            cy.get('.blueprintsWidget input[placeholder^=Search]').clear().type(blueprintName);

            cy.contains('.deploymentsWidget .row', deploymentName).find('.green.checkmark');
            cy.contains('.deploymentsWidget .row', deploymentName).find('.menuAction').click();
            cy.contains('Force Delete').click();
            cy.contains('Yes').click();

            cy.contains('.deploymentsWidget .row', deploymentName).should('not.exist');

            cy.get('.deploymentFilterField > .text.default');
            cy.get('.deploymentFilterField input').type(deploymentName, { force: true });
            cy.contains('.deploymentFilterField', 'No results found.');
        });

        it('blueprint upload and removal', () => {
            cy.get('.blueprintsWidget input[placeholder^=Search]').clear().type(blueprintName);
            cy.get(`.blueprintsWidget .${blueprintName}`).parent().find('.trash').click();
            cy.contains('Yes').click();

            cy.get('.blueprintFilterField > .label').should('not.exist');
            cy.get('.blueprintFilterField input').type(blueprintName, { force: true });
            cy.contains('.blueprintFilterField', 'No results found.');
        });
    });
});
