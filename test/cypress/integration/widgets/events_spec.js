describe('Events/logs widget', () => {
    it('should show error cause', () => {
        cy.activate()
            .disableGettingStarted()
            .usePageMock('events', { fieldsToShow: ['Message', 'Workflow'], pageSize: 15 })
            .interceptSp('GET', '/events?_size=15&_offset=0', { fixture: 'events/events.json' })
            .mockLogin();

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
