import { secondsToMs } from 'test/cypress/support/resource_commons';

describe('Filter', () => {
    before(() => {
        cy.activate('valid_trial_license')
            .deleteAllUsersAndTenants()
            .usePageMock(['blueprints', 'deployments'], { pollingTime: 3 })
            .mockLogin();
    });

    it('fills dropdowns with correct data', () => {
        const getDropdownItems = (id?: string) => (id ? cy.get(`${id} .menu > *`) : cy.get('.menu > *'));

        cy.interceptSp(
            'GET',
            { pathname: '/blueprints', query: { state: 'uploaded' } },
            { fixture: 'filter/blueprints.json' }
        ).as('fetchBlueprints');
        cy.interceptSp(
            'GET',
            { pathname: '/deployments', query: { _offset: '0', _search: '', _search_name: '' } },
            {
                fixture: 'filter/deployments0.json'
            }
        ).as('fetchDeployments');
        cy.interceptSp(
            'GET',
            { pathname: '/deployments', query: { _offset: '0', _search: 'ead', _search_name: 'ead' } },
            {
                fixture: 'filter/deployments0.json'
            }
        ).as('fetchFilteredDeployments');
        cy.interceptSp(
            'GET',
            { pathname: '/deployments', query: { _offset: '20' } },
            { fixture: 'filter/deployments1.json' }
        ).as('fetchDeploymentsOffset');
        cy.interceptSp('GET', '/executions', { fixture: 'filter/executions.json' }).as('fetchExecutions');

        cy.get('#dynamicDropdown1').click();
        cy.wait('@fetchBlueprints');
        cy.contains('app2.2-clickme').click();
        cy.get('#dynamicDropdown1 > .label').should('have.length', 1);

        cy.get('#dynamicDropdown2').within(() => {
            cy.root().click();
            cy.wait('@fetchDeployments');
            cy.get('.menu > *:eq(0)').should('have.text', 'App 2.2 (app2.2)');
            cy.get('.menu > *:eq(1)').should('have.text', 'Eadu (uuu)');
            getDropdownItems().should('have.length', 2);

            cy.get('input').type('ead');
            cy.wait('@fetchFilteredDeployments');

            getDropdownItems().should('have.length', 1);
            cy.get('input').clear();
            cy.get('.loader').should('be.visible');
            cy.wait('@fetchDeployments');
            cy.get('.loader').should('not.exist');
            getDropdownItems().should('have.length', 2);

            cy.contains('uuu').click();
            cy.get('.label').should('have.length', 1);
        });

        cy.get('#dynamicDropdown3').click();
        cy.wait('@fetchExecutions');
        getDropdownItems('#dynamicDropdown3').should('have.text', 'uuustatus').should('have.length', 1).click();
        cy.get('#dynamicDropdown3 > .label').should('have.length', 1);

        cy.get('#dynamicDropdown1 > .label .delete').click();
        cy.get('#dynamicDropdown1 > .label').should('have.length', 0);

        cy.get('#dynamicDropdown2 > .label').should('have.length', 0);
        cy.get('#dynamicDropdown2').click();

        cy.wait('@fetchDeploymentsOffset');
        getDropdownItems('#dynamicDropdown2').should('have.length', 24);

        cy.get('#dynamicDropdown3 > .label').should('have.length', 1);
        cy.get('#dynamicDropdown3').click();
        getDropdownItems('#dynamicDropdown3').should('have.length', 2);
    });

    describe('refreshes dropdown data on', () => {
        const blueprintName = 'filter-test';

        function getBlueprintSegment(bpName: string) {
            return cy.getByTestId(bpName);
        }

        before(() =>
            cy
                .deleteDeployments(blueprintName)
                .deleteBlueprints(blueprintName)
                .uploadBlueprint('blueprints/empty.zip', blueprintName)
                .refreshTemplate()
        );

        beforeEach(() => cy.setBlueprintContext(blueprintName));

        it('deployment creation and removal', () => {
            const deploymentName = `${blueprintName}-deployment`;
            cy.interceptSp('DELETE', `/deployments/${deploymentName}`).as('deleteDeployment');
            cy.interceptSp('GET', '/deployments').as('deploymentList');
            cy.get('.blueprintsWidget').within(() => {
                cy.getSearchInput().scrollIntoView().clear().type(blueprintName);
                getBlueprintSegment(blueprintName).find('.rocket').click();
            });
            cy.get('input[name=deploymentName]').type(deploymentName);
            cy.openAccordionSection('Advanced');
            cy.get('input[name=deploymentId]').clear().type(deploymentName);
            cy.contains('Runtime only evaluation').click();
            cy.selectAndClickDeploy();

            cy.contains('.breadcrumb', deploymentName, {
                timeout: secondsToMs(30)
            });
            cy.refreshPage();

            cy.get('.blueprintsWidget').within(() => cy.getSearchInput().scrollIntoView().clear().type(blueprintName));

            cy.searchInDeploymentsWidget(deploymentName);
            // Triggering mouseout event just after the click to hide the tooltip
            cy.contains('.row', deploymentName).find('.deploymentActionsMenu').click().trigger('mouseout');
            cy.contains('Force Delete').click();
            cy.contains('Yes').click();
            cy.wait('@deleteDeployment');

            cy.wait('@deploymentList');
            cy.contains('.deploymentsWidget .row', deploymentName).should('not.exist');

            cy.get('.deploymentFilterField > .text.default');
            cy.get('.deploymentFilterField input').type(deploymentName, { force: true });
            cy.contains('.deploymentFilterField .message', 'No results found.');
        });

        it('blueprint upload and removal', () => {
            cy.get('.blueprintsWidget').within(() => {
                cy.getSearchInput().scrollIntoView().clear().type(blueprintName);
                getBlueprintSegment(blueprintName).find('.trash').click();
            });
            cy.contains('Yes').click();

            cy.get('.blueprintFilterField > .label').should('not.exist');
            cy.get('.blueprintFilterField input').type(blueprintName, { force: true });
            cy.contains('.blueprintFilterField .message', 'No results found.');
        });
    });
});
