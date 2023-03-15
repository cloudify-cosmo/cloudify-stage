describe('Blueprints widget should open upload from HELM chart modal and', () => {
    before(() => {
        cy.activate().useWidgetWithDefaultConfiguration('blueprints');
    });

    beforeEach(() => {
        cy.visitTestPage();
        cy.contains(/Upload$/).click();
        cy.contains('Upload from HELM chart').click();
    });

    it('creates blueprint on submit', () => {
        const blueprintId = 'helm_test_blueprint';
        const secretKey = 'heml_test_secret';

        cy.deleteBlueprint(blueprintId);
        cy.createSecret(secretKey, '0');

        const repository = 'http://repo.io';
        const chart = 'xyz';
        const description = 'desc';
        const input = 'inputName';

        cy.typeToFieldInput('HELM repository', repository);
        cy.typeToFieldInput('HELM chart', chart);
        cy.typeToFieldInput('Blueprint name', blueprintId);
        cy.getField('Blueprint description').find('textarea').type(description);
        cy.contains('.fields', 'Cluster hostname').find('input').type(input);
        cy.contains('.fields', 'Cluster API key').find('input').type(`${secretKey}{enter}`);
        cy.contains('.fields', 'Certificate').find('input').type(`${secretKey}{enter}`);

        cy.intercept('/console/helm/blueprint').as('generateBlueprint');
        cy.clickButton('Create');

        cy.wait('@generateBlueprint').then(({ request }) => {
            expect(request.body.repository).to.eq(repository);
            expect(request.body.chart).to.eq(chart);
            expect(request.body.description).to.eq(description);

            const { clusterCredentials } = request.body;
            expect(clusterCredentials.host.source).to.eq('input');
            expect(clusterCredentials.host.value).to.eq(input);
            expect(clusterCredentials.api_key.source).to.eq('secret');
            expect(clusterCredentials.api_key.value).to.eq(secretKey);
            expect(clusterCredentials.ssl_ca_cert.source).to.eq('secret');
            expect(clusterCredentials.ssl_ca_cert.value).to.eq(secretKey);
        });

        cy.contains('.breadcrumb', blueprintId);
    });

    it('validates form data', () => {
        cy.clickButton('Create');
        cy.contains('Please provide HELM repository').should('be.visible');
        cy.contains('Please provide blueprint name').should('be.visible');
        cy.contains('.fields', 'Cluster hostname').contains('Please provide input name');
        cy.contains('.fields', 'Cluster API key').contains('Please provide secret key');
        cy.contains('.fields', 'Certificate').contains('Please provide secret key');

        cy.typeToFieldInput('HELM repository', 'invalid');
        cy.typeToFieldInput('Blueprint name', '!@#$%^');
        cy.clickButton('Create');
        cy.contains('Please provide valid HELM repository URL').scrollIntoView().should('be.visible');
        cy.contains('Please provide valid blueprint name').should('be.visible');
    });
});
