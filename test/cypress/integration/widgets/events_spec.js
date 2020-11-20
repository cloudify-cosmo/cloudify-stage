describe('Events/logs widget', () => {
    it('should show error cause', () => {
        cy.activate()
            .usePageMock('events', { fieldsToShow: ['Message'], pageSize: 15 })
            .route({
                url: '/console/sp?su=/events?_size=15&_offset=0',
                response: 'fixture:events/events.json'
            })
            .login();

        cy.get('.file').click();

        cy.contains('Error type');
        cy.contains('Error message');
        cy.contains('Error traceback');

        cy.contains('Close').click();
        cy.get('.modal').should('not.exist');
    });
});
