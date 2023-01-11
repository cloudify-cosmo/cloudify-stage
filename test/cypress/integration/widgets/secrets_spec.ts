describe('Secret store management widget', () => {
    const secretName = 'secrets_test';

    before(() =>
        cy
            .activate()
            .usePageMock('secrets')
            .mockLogin()
            .deleteSecrets(secretName)
            .deleteSecretProviders()
            .createSecretProvider({ name: 'Secret_Provider_1', type: 'vault', visibility: 'global' })
    );

    it('should allow to manage secrets', () => {
        const secretValue = 'confidental';
        cy.log('Creating a secret');
        cy.contains('Create').click();
        cy.get('.modal').within(() => {
            cy.get('input[name=secretKey]').type(secretName);
            cy.get('textarea').type(secretValue);
            cy.clickButton('Create');
        });

        cy.get('.secretsWidget').within(() => {
            cy.getSearchInput().type(secretName);
            cy.get('tbody tr').should('have.length', 1);
        });

        cy.log("Verifying 'hidden' flag can be set and unset");
        cy.get('.secretsWidget').within(() => {
            cy.get('.checkbox').click();
            cy.get('.checkbox.checked').click();
            cy.get('.checkbox:not(.checked)');
        });

        cy.log('Verifying secret value can be edited');
        const newValue = 'top_secret';
        cy.get('.secretsWidget .edit').click();
        cy.contains(secretValue);
        cy.get('textarea').clear().type(newValue);
        cy.clickButton('Update');
        cy.get('.secretsWidget').within(() => {
            cy.get('.unhide').click();
            cy.contains(newValue);
            cy.get('.hide').click();
            cy.contains(newValue).should('not.exist');
        });

        cy.log('Verifying secret visibility can be changed');
        cy.get('.secretsWidget .user').click();
        cy.contains('Global').click();
        cy.contains('Yes').click();
        cy.get('.secretsWidget .globe');

        cy.log('Verifying secret can be deleted');
        cy.get('.secretsWidget .trash').click();
        cy.contains('Yes').click();
        cy.contains('There are no Secrets available');
    });

    it('should allow to manage secret with secret provider', () => {
        const secretProviderName = 'Secret_Provider_1';
        cy.contains('Create').click();

        cy.get('.modal').within(() => {
            cy.contains('.checkbox', 'Retrieve the secret value from a secret provider').click();
            cy.clickButton('Create');
            cy.contains('Please select a secret provider').should('be.visible');
            cy.contains('Please provide a path or a secret key on the secret provider').should('be.visible');
            cy.openDropdown('secretProvider').within(() => {
                cy.get(`[option-value=${secretProviderName}]`).click();
            });
            cy.get('input[name=secretKey]').type(secretName);
            cy.get('input[name=secretProviderPath]').type(secretName);
            cy.clickButton('Create');
        });

        cy.get('.secretsWidget').within(() => {
            cy.getSearchInput().type(secretName);
            cy.get('tbody tr').should('have.length', 1);
            cy.contains(secretProviderName);
        });
    });
});
