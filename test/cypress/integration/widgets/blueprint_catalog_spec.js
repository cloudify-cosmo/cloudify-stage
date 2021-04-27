describe('Blueprints catalog widget', () => {
    const blueprintName = 'blueprints_catalog_test';

    before(() =>
        cy
            .activate('valid_trial_license')
            .disableGettingStarted()
            .usePageMock('blueprintCatalog', {
                jsonPath: 'https://repository.cloudifysource.org/cloudify/blueprints/5.1/vm-examples.json'
            })
            .mockLogin()
            .deleteBlueprints(blueprintName, true)
            .deletePlugins()
    );

    beforeEach(() => {
        cy.refreshPage();
        cy.contains('.segment', 'AWS-Basics-VM-Setup').contains('Upload').click();
    });

    it('should validate upload form', () => {
        cy.get('input[name=blueprintName]').clear();
        cy.get('.clear').click();
        cy.get('button.green').click();
        cy.contains('Please provide blueprint name');
        cy.contains('Please provide blueprint YAML file');
    });

    it('should handle manager errors on upload form submit', () => {
        cy.get('input[name=blueprintName]').clear().type(blueprintName);
        cy.get('button.green').click();
        cy.contains(
            "Invalid blueprint - Plugin cloudify-aws-plugin (query: {'package_name': 'cloudify-aws-plugin'}) not found"
        );

        cy.interceptSp('PUT', `/blueprints/${blueprintName}`, {});
        const error = 'error message';
        cy.interceptSp('GET', `/blueprints/${blueprintName}`, { state: 'failed_uploading', error });

        cy.get('button.green').click();

        cy.contains('.header', 'Blueprint upload failed');
        cy.contains('li', error);
    });

    it('should upload blueprint successfully', () => {
        cy.get('input[name=blueprintName]').clear().type(blueprintName);

        cy.interceptSp('PUT', `/blueprints/${blueprintName}`, {});
        cy.interceptSp('GET', `/blueprints/${blueprintName}`, { state: 'uploaded' });

        cy.get('button.green').click();

        cy.get('.modal').should('not.exist');
    });
});
