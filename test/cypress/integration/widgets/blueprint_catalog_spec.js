describe('Blueprints catalog widget', () => {
    const blueprintName = 'blueprints_catalog_test';

    before(() => cy.activate('valid_trial_license').login().deleteBlueprints(blueprintName, true).deletePlugins());

    beforeEach(() => {
        cy.visitPage('Cloudify Catalog');
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
    });
});
