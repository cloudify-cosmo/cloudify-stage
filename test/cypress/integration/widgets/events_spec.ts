describe('Events/logs widget', () => {
    before(() => {
        cy.activate()
            .usePageMock('events', {
                fieldsToShow: ['Message', 'Workflow', 'Deployment', 'Deployment Id'],
                pageSize: 15
            })
            .interceptSp('GET', '/events?_size=15&_offset=0', { fixture: 'events/events.json' })
            .mockLogin();
    });
    it('should show deployment ID and display name', () => {
        cy.get('table')
            .getTable()
            .should(tableData => {
                expect(tableData[0].Deployment).to.eq('Mustafar Env Deployment');
                expect(tableData[0]['Deployment Id']).to.eq('c0d7be2f-15cf-4dac-a53c-c0ebade023c5');
            });
    });

    it('should show error cause', () => {
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
