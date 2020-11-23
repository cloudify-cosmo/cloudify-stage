describe('Events/logs widget', () => {
    it('should show error cause', () => {
        cy.activate().login();

        cy.server();
        cy.route({
            url: '/console/sp?su=/events?_sort=-timestamp&_size=15&_offset=0',
            response: 'fixture:events/events.json'
        });

        cy.visitPage('Logs');

        cy.contains('tr', 'create_snapshot').find('.file').click();
        cy.contains('Error type');
        cy.contains('Error message');
        cy.contains('Error traceback');
        cy.contains('Close').click();
        cy.get('.modal').should('not.exist');

        cy.contains('tr', 'restore_snapshot').find('.file').click();
        cy.contains('Error type');
        cy.contains('Error message');
        cy.contains('Error traceback').should('not.exist');
        cy.contains('Close').click();
        cy.get('.modal').should('not.exist');
    });
});
