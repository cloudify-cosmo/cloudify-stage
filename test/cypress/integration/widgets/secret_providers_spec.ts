const widgetId = 'secretProviders';
const widgetConfiguration = {
    pollingTime: 3,
    pageSize: 0 // NOTE: Setting page size to 0 to list all secret providers and be able to find the one created in test
};
function getSecretProviderRow(name: string) {
    return cy.contains(name).parent();
}

describe('Secret Providers widget', () => {
    before(() => {
        cy.fixture('secret_providers/secret_providers').then(secretProviders => {
            const { name, type, visibility } = secretProviders[0];
            cy.activate('valid_trial_license')
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
});
