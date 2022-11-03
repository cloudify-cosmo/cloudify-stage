describe('Blueprints catalog widget', () => {
    const blueprintName = 'AWS-Basics-VM-Setup';

    before(() =>
        cy
            .activate()
            .usePageMock('blueprintCatalog', {
                jsonPath:
                    'https://raw.githubusercontent.com/cloudify-cosmo/cloudify-stage/ab8dfce1874456ae2fed24d82e5b85f4b16c1765/test/cypress/fixtures/blueprints/blueprintsCatalog.json',
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
        const iconNames = ['github', 'gitlab', 'bitbucket', 'git'];
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
