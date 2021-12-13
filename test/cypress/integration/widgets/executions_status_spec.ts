describe('Executions Statuses Graph widget', () => {
    const widgetId = 'executionsStatus';
    const executionQuantity = 12;

    before(() =>
        cy
            .activate('valid_trial_license')
            .interceptSp('GET', '/summary/executions', {
                items: [
                    {
                        status_display: 'completed',
                        executions: executionQuantity
                    }
                ],
                metadata: {
                    pagination: {
                        total: 1,
                        size: 1000,
                        offset: 0
                    }
                }
            })
            .usePageMock(widgetId)
            .mockLogin()
    );

    it('should show the number of executions', () => {
        const graphColumnSelector = '.recharts-layer.recharts-bar-rectangle';
        const graphTooltipSelector = '.recharts-tooltip-wrapper';

        cy.getWidget(widgetId).within(() => {
            cy.get(graphColumnSelector).first().trigger('mouseover', { force: true });
            cy.get(graphTooltipSelector).should('contain.text', executionQuantity);
        });
    });
});
