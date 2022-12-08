describe('Secret Providers widget', () => {
    const widgetId = 'secretProviders';
    const widgetConfiguration = {
        pollingTime: 3,
        pageSize: 0 // NOTE: Setting page size to 0 to list all secret providers and be able to find the one created in test
    };
    // TODO improve this tests
    before(() => {
        cy.fixture('secret_providers/secret_providers').then(secretProviders => {
            cy.activate('valid_trial_license')
                .createSecretProvider({
                    name: secretProviders[0].name,
                    type: secretProviders[0].type,
                    visibility: secretProviders[0].visibility
                })
                .usePageMock(widgetId, widgetConfiguration)
                .mockLogin();
        });
    });

    it('should allow to list secret providers', () => {
        cy.contains('Secret_Provider_1').should('be.visible');
    });

    it('should allow to delete secret providers', () => {
        cy.contains('Secret_Provider_1').parent().find('.trash').click();
    });
});
