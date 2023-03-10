describe('Blueprints widget should open upload from HELM chart modal and', () => {
    before(() => {
        cy.activate().useWidgetWithDefaultConfiguration('blueprints');
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

        cy.contains(/Upload$/).click();
        cy.contains('Upload from HELM chart').click();
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
});
