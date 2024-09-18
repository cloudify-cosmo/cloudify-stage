import { minutesToMs } from '../../support/resource_commons';

describe('Blueprints catalog widget', () => {
    const blueprintName = 'GCP-Basics-VM-Setup';

    function uploadBlueprint(timeout?: number) {
        cy.contains('.segment', blueprintName).contains('Upload').click();
        cy.contains('.ui.label.section.active.pageTitle', blueprintName, { timeout });
    }

    before(() =>
        cy
            .activate()
            .usePageMock('blueprintCatalog', {
                jsonPath: 'https://repository.cloudifysource.org/cloudify/blueprints/6.3/vm-examples.json',
                displayStyle: 'catalog',
                fieldsToShow: ['Name', 'Description']
            })
            .mockLogin()
            .deleteBlueprints(blueprintName, true)
            .deletePlugins()
    );

    beforeEach(() => {
        cy.refreshPage();
    });

    it('should handle manager errors on upload form submit', () => {
        cy.interceptSp('PUT', `/blueprints/${blueprintName}`, {});
        const error = 'error message';
        cy.interceptSp('GET', `/blueprints/${blueprintName}`, { state: 'failed_uploading', error });

        cy.contains('.segment', blueprintName).contains('Upload').click();

        cy.contains('.header', 'Error Occurred');
        cy.contains('li', error);
    });

    it('should upload blueprint successfully', () => {
        cy.interceptSp('PUT', `/blueprints/${blueprintName}`, {});
        cy.interceptSp('GET', `/blueprints/${blueprintName}`, { state: 'uploaded' });
        cy.interceptSp('PATCH', `/blueprints/${blueprintName}/icon`, { state: 'uploaded' });

        uploadBlueprint();
    });

    it('should open a page for uploaded blueprint successfully', () => {
        uploadBlueprint(minutesToMs(1));

        cy.go('back');

        cy.contains('button', 'Open').click();
        cy.contains('.ui.label', blueprintName);
    });

    it('should allow to change display style', () => {
        cy.editWidgetConfiguration('blueprintCatalog', () => cy.setMultipleDropdownValues('Display style', ['Table']));

        cy.get('.blueprintCatalogWidget table').should('be.visible');
    });

    it('should allow to customize fields to show', () => {
        cy.editWidgetConfiguration('blueprintCatalog', () => {
            cy.clearMultipleDropdown('List of fields to show');
            cy.setMultipleDropdownValues('List of fields to show', ['Name', 'Created']);
        });
        cy.get('.blueprintCatalogWidget').within(() => {
            cy.contains('Name').should('be.visible');
            cy.contains('Created').should('be.visible');
            cy.contains('Updated').should('not.exist');
            cy.contains('Description').should('not.exist');
        });
    });

    it('should show different icons depending on blueprint repository URL', () => {
        cy.intercept('/console/external/content*', { fixture: 'blueprints/blueprintsCatalog.json' }).as(
            'blueprintsCatalog'
        );
        cy.usePageMock('blueprintCatalog', {
            jsonPath: 'test', // this is required to avoid using default mock
            displayStyle: 'table',
            fieldsToShow: ['Name', 'Description']
        }).mockLogin();
        const iconNames = ['gitlab', 'bitbucket', 'git'];

        cy.get('.blueprintCatalogWidget').within(() => {
            iconNames.forEach(iconName => {
                cy.get(`tr[class$="${iconName}"]`).within(() => {
                    cy.get('i[title="Open blueprint repository"]').should('have.class', iconName);
                });
            });
        });
    });
});
