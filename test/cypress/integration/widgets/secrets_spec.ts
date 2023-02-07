describe('Secret store management widget', () => {
    const secretName = 'secrets_test';
    const secretProviderName = 'Secret_Provider_1';
    const newSecretProviderName = 'Secret_Provider_2';

    before(() =>
        cy
            .activate()
            .deleteSecrets(secretName)
            .deleteSecretProviders()
            .createSecretProvider({ name: secretProviderName, type: 'vault', visibility: 'global' })
            .usePageMock('secrets')
            .mockLogin()
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
        cy.contains('Create').click();

        cy.get('.modal').within(() => {
            cy.getField('Secret key').find('input').type(secretName);
            cy.contains('.checkbox', 'Retrieve the secret value from a secret provider').click();
            cy.clickButton('Create');
            cy.contains('Please select a secret provider').should('be.visible');
            cy.contains('Please provide a path or a secret key on the secret provider').should('be.visible');
            cy.setSingleDropdownValue(secretProviderName, secretProviderName);
            cy.getField('Path at the provider').find('input').type(secretName);
            cy.clickButton('Create');
        });

        cy.getWidget('secrets').within(() => {
            cy.createSecretProvider({ name: newSecretProviderName, type: 'vault', visibility: 'global' });
            cy.get('.rowActions').children().eq(1).click();
        });

        cy.get('.modal').within(() => {
            cy.setSingleDropdownValue(secretProviderName, newSecretProviderName);
            cy.getField('Path at the provider').find('input').type('new/path');
            cy.clickButton('Update');
        });

        cy.getWidget('secrets').within(() => {
            cy.get('tbody tr').should('have.length', 1);
            cy.contains(newSecretProviderName);
        });
    });

    it('should not allow to create secret with secret provider if they are not defined in the system', () => {
        cy.deleteSecrets(secretName);
        cy.deleteSecretProviders();

        cy.contains('Create').click();
        cy.get('.modal').within(() => {
            cy.getField('Secret key').find('input').type(secretName);
            cy.contains('.checkbox', 'Retrieve the secret value from a secret provider').should(
                'have.class',
                'disabled'
            );
        });
    });
});
