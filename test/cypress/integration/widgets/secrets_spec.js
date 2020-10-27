describe('Secret store management widget', () => {
    const secretName = 'secrets_test';

    before(() => cy.activate().login().deleteSecrets(secretName).visitPage('System Resources'));

    it('should allow to manage secrets', () => {
        const secretValue = 'confidental';
        cy.log('Creating a secret');
        cy.contains('Create').click();
        cy.get('.modal').within(() => {
            cy.get('input[name=secretKey]').type(secretName);
            cy.get('textarea').type(secretValue);
            cy.get('button.green').click();
        });

        cy.get('.secretsWidget').within(() => {
            cy.get('input[placeholder="Search..."]').type(secretName);
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
        cy.get('button.green').click();
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
});
