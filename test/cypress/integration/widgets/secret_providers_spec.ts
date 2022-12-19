function getSecretProviderRow(name: string) {
    return cy.contains(name).parent();
}

describe('Secret Providers widget', () => {
    const widgetId = 'secretProviders';
    const widgetConfiguration = {
        pollingTime: 3,
        pageSize: 0 // NOTE: Setting page size to 0 to list all secret providers and be able to find the one created in test
    };

    before(() => {
        cy.fixture('secret_providers/secret_providers').then(secretProviders => {
            const { name, type, visibility } = secretProviders[0];
            cy.activate('valid_trial_license')
                .deleteSecretProviders()
                .createSecretProvider({ name, type, visibility })
                .usePageMock(widgetId, widgetConfiguration)
                .mockLogin();
        });
    });

    it('should allow to list secret providers', () => {
        cy.contains('Secret_Provider_1').should('be.visible');
    });

    it('should allow to delete secret providers', () => {
        getSecretProviderRow('Secret_Provider_1').find('i[title="Delete Secret Provider"]').click();
        cy.contains('Yes').click();
        cy.contains('Secret_Provider_1').should('not.exist');
    });

    it('should allow to create secret providers', () => {
        cy.getWidget(widgetId).within(() => {
            cy.contains('Create').click();
            cy.contains('Vault').click();
        });

        cy.get('.modal').within(() => {
            cy.clickButton('Create');
            cy.contains('Please provide the Provider Name.').should('be.visible');
            cy.contains('Please provide vault hostname.').should('be.visible');
            cy.contains('Please provide an authorization token').should('be.visible');

            cy.get('input[name="providerName"]').type('Secret_Provider_2');
            cy.get('input[name="hostname"]').type('localhost');
            cy.get('input[name="authorizationToken"]').type('token');
            cy.get('button').contains('Create').click();
        });
        cy.contains('Secret_Provider_2').should('be.visible');
    });
});
