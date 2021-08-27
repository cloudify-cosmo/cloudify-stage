describe('Blueprints catalog widget', () => {
    const blueprintName = 'AWS-Basics-VM-Setup';

    before(() =>
        cy
            .activate('valid_trial_license')
            .usePageMock('blueprintCatalog', {
                jsonPath: 'https://repository.cloudifysource.org/cloudify/blueprints/5.1/vm-examples.json'
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

        cy.contains('.header', 'Error Occured');
        cy.contains(
            "Invalid blueprint - Plugin cloudify-aws-plugin (query: {'package_name': 'cloudify-aws-plugin'}) not found"
        );
        cy.contains('li', error);
    });

    it('should upload blueprint successfully', () => {
        cy.interceptSp('PUT', `/blueprints/${blueprintName}`, {});
        cy.interceptSp('GET', `/blueprints/${blueprintName}`, { state: 'uploaded' });

        cy.contains('.segment', blueprintName).contains('Upload').click();
        cy.contains('.ui.label.section.active.pageTitle', blueprintName);
    });
});
