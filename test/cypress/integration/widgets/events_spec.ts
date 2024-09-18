describe('Events/logs widget', () => {
    const widgetId = 'events';

    before(() => {
        cy.activate()
            .usePageMock(widgetId, {
                fieldsToShow: ['Message', 'Workflow', 'Deployment', 'Deployment ID'],
                pageSize: 15
            })
            .interceptSp(
                'GET',
                { pathname: '/events', query: { _size: '15', _offset: '0' } },
                { fixture: 'events/events.json' }
            )
            .mockLogin();
    });
    it('should show deployment ID and display name', () => {
        cy.getWidget(widgetId)
            .find('table')
            .getTable()
            .should(tableData => {
                expect(tableData[0].Deployment).to.eq('Mustafar Env Deployment');
                expect(tableData[0]['Deployment ID']).to.eq('c0d7be2f-15cf-4dac-a53c-c0ebade023c5');
            });
    });

    it('should show error details', () => {
        cy.contains('tr', 'create_snapshot').find('.file').click({ force: true });
        cy.get('.modal').within(() => {
            cy.contains('.medium', 'Message')
                .nextAll('pre')
                .contains('Removing temp dir: /tmp/tmp0lc9t1hi-snapshot-data');
            cy.contains('.segment', 'Error Cause').within(() => {
                cy.contains('Type').next().contains('Error type');
                cy.contains('Message').next().contains('Error message');
                cy.contains('Traceback').next().contains('Error traceback');
            });
            cy.contains('Close').click();
        });
        cy.get('.modal').should('not.exist');

        cy.contains('tr', 'restore_snapshot').find('.file').click({ force: true });
        cy.get('.modal').within(() => {
            cy.contains('.medium', 'Message').nextAll('pre').contains('Another message');
            cy.contains('.segment', 'Error Cause').within(() => {
                cy.contains('Type').next().contains('Another error type');
                cy.contains('Message').next().contains('Another error message');
                cy.contains('Traceback').should('not.exist');
            });
            cy.contains('Close').click();
        });
        cy.get('.modal').should('not.exist');
    });
});
