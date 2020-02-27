describe('Filter', () => {
    before(() => {
        cy.activate('valid_spire_license')
            .deleteAllUsersAndTenants()
            .login();
    });

    it('fills dropdowns with correct data', () => {
        cy.server();
        cy.route(/console\/sp\/\?su=\/blueprints/, 'fixture:filter/blueprints.json');
        cy.route(/console\/sp\/\?su=\/deployments.*offset=0/, 'fixture:filter/deployments0.json');
        cy.route(/console\/sp\/\?su=\/deployments.*offset=20/, 'fixture:filter/deployments1.json');
        cy.route(/console\/sp\/\?su=\/executions/, 'fixture:filter/executions.json');

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
        cy.get('#dynamicDropdown3 .menu > *')
            .should('have.text', 'uuustatus')
            .should('have.length', 1)
            .click();
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
        before(() => {
            cy.get('.usersMenu')
                .click()
                .contains('Reset Templates')
                .click();
            cy.contains('Yes').click();

            cy.contains('Cloudify Catalog').click();
            cy.contains('tr', 'AWS')
                .find('button')
                .click();
            cy.contains('.ok', 'Upload').click();
            cy.contains('.ok.loading', 'Upload').should('not.exist');

            cy.get('body').type('{esc}');
        });

        function uploadExampleBlueprint() {
            const blueprint = 'aws-example-network';
            cy.contains('.segment', blueprint)
                .contains('Upload')
                .click();
            const blueprintNameSuffix = Date.now();
            cy.get('input[name=blueprintName]').type(blueprintNameSuffix);
            cy.contains('.ok', 'Upload').click();

            return blueprint + blueprintNameSuffix;
        }

        it('blueprint upload and removal', () => {
            cy.get('.usersMenu')
                .click()
                .contains('Edit Mode')
                .click();
            cy.contains('Add Widget').click();
            cy.get('*[data-id=filter]').click();
            cy.get('*[data-id=blueprintActionButtons]').click();
            cy.contains('Add selected widgets').click();
            cy.contains('.message', 'Edit mode')
                .contains('Exit')
                .click();

            cy.get('.blueprintFilterField').click();

            const blueprintName = uploadExampleBlueprint();
            cy.get('.blueprintFilterField input').type(blueprintName);
            cy.get(`div[option-value=${blueprintName}]`).click();

            cy.contains('Delete blueprint').click();
            cy.contains('Yes').click();

            cy.get('.blueprintFilterField > .label').should('not.exist');
            cy.get('.blueprintFilterField input').type(blueprintName);
            cy.contains('.blueprintFilterField', 'No results found.');
        });

        it('deployment creation and removal', () => {
            const blueprintName = uploadExampleBlueprint();

            cy.contains('Deployments').click();
            cy.get('.usersMenu')
                .click()
                .contains('Edit Mode')
                .click();
            cy.get('.filterWidget .setting').click({ force: true });
            cy.contains('div', 'Show deployment filter')
                .find('.toggle')
                .click();
            cy.contains('Save').click();
            cy.contains('.message', 'Edit mode')
                .contains('Exit')
                .click();

            cy.get('.deploymentFilterField').click();

            cy.contains('Create Deployment').click();
            const deploymentName = `deployment${Date.now()}`;
            cy.get('input[name=deploymentName]').type(deploymentName);
            cy.get('div[name=blueprintName] input').type(blueprintName);
            cy.get(`div[option-value=${blueprintName}]`).click();
            cy.contains('Runtime only evaluation').click();
            cy.contains('.modal button', 'Deploy').click();

            cy.get('.deploymentFilterField input').type(deploymentName);
            cy.get(`div[option-value=${deploymentName}]`).click();

            cy.contains('.deploymentsWidget .row', deploymentName)
                .find('.menuAction')
                .click();
            cy.contains('Force Delete').click();
            cy.contains('Yes').click();

            cy.get('.deploymentFilterField > .text.default');
            cy.get('.deploymentFilterField input').type(deploymentName);
            cy.contains('.deploymentFilterField', 'No results found.');
        });
    });
});
