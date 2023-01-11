function getSecretProviderRow(name: string) {
    return cy.contains(name).parent();
}

function createSecretProvider(hostname: string, token: string, path?: string, name?: string) {
    cy.contains('Create').click();
    cy.typeToFieldInput('Vault Hostname', hostname);
    cy.typeToFieldInput('Authorization Token', token);
    if (path) {
        cy.typeToFieldInput('Path', path);
    }
    if (name) {
        cy.typeToFieldInput('Provider Name', name);
    }
    cy.clickButton('Create');
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
        cy.clickButton('Yes');
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
            createSecretProvider('localhost', 'token', '', 'Secret_Provider_2');
        });
        cy.contains('Secret_Provider_2').should('be.visible');
    });

    it('should allow to update secret provider', () => {
        getSecretProviderRow('Secret_Provider_2').find('td').eq(3).should('be.empty');
        getSecretProviderRow('Secret_Provider_2').find('i[title="Update Secret Provider"]').click();
        createSecretProvider('localhost_test', 'token_test', 'path_test', '');
        getSecretProviderRow('Secret_Provider_2').find('td').eq(3).should('not.be.empty');
    });
});
