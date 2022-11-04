describe('Blueprints catalog widget', () => {
    const blueprintName = 'AWS-Basics-VM-Setup';

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

        cy.contains('.segment', blueprintName).contains('Upload').click();
        cy.contains('.ui.label.section.active.pageTitle', blueprintName);
    });

    it('should allow to change display style', () => {
        cy.editWidgetConfiguration('blueprintCatalog', () => {
            cy.setMultipleDropdownValues('Display style', ['Table']);
        });

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

    it('should have segment with correct icons', () => {
        cy.intercept('/console/external/content*', { fixture: 'blueprints/blueprintsCatalog.json' }).as(
            'blueprintsCatalog'
        );
        cy.usePageMock('blueprintCatalog', {
            jsonPath: 'test', // this is required to avoid using default mock
            displayStyle: 'catalog',
            fieldsToShow: ['Name', 'Description']
        }).mockLogin();
        cy.wait('@blueprintsCatalog');
        const iconNames = ['gitlab', 'bitbucket', 'git'];
        const selectorMatch = (selector: string) => {
            // eslint-disable-next-line security/detect-non-literal-regexp
            return new RegExp(`.+${selector}$`);
        };

        iconNames.forEach(iconName => {
            cy.get('.blueprintCatalogWidget').within(() => {
                cy.contains(selectorMatch(iconName))
                    .parent()
                    .parent()
                    .parent()
                    .within(() => {
                        cy.get(`i.${iconName}.icon`).should('have.class', iconName);
                    });
            });
        });
    });
});
