describe('User-defined widgets', () => {
    before(cy.activate);

    describe('Fibonacci sequence widget', () => {
        const initialSequence = [1, 1];
        const widgetFixturePath = 'widgets/fibonacciSequenceWidget.tsx';
        const widgetId = 'fibonacci-sequence-widget';

        it('render itself once with the initial sequence', () => {
            const widgetConfiguration = { targetSequenceLength: initialSequence.length };
            useMockWidgetFixture(widgetFixturePath, widgetId, widgetConfiguration);

            cy.contains(`Current sequence: ${JSON.stringify(initialSequence)}`);
        });

        it('render itself recursively with intermediate sequences', () => {
            const sequence = [1, 1, 2, 3, 5, 8, 13, 21, 34];
            const widgetConfiguration = { targetSequenceLength: sequence.length };
            useMockWidgetFixture(widgetFixturePath, widgetId, widgetConfiguration);
            const initialSequenceLength = initialSequence.length;

            Array.from({ length: sequence.length - initialSequenceLength }).forEach((_, index) => {
                cy.contains(`Current sequence: ${JSON.stringify(sequence.slice(0, initialSequenceLength + index))}`);
            });
        });
    });

    describe('Split view widget', () => {
        const widgetFixturePath = 'widgets/splitViewWidget.tsx';
        const widgetId = 'split-view-widget';

        it('should render itself and the nested Plugins Catalog widget', () => {
            useMockWidgetFixture(widgetFixturePath, widgetId);

            cy.contains('Content on the left');
            cy.contains('Content on the right');
            cy.getWidget('pluginsCatalog').within(() => {
                cy.contains('Plugins Catalog').should('be.visible');
                // NOTE: make sure the content of the widget is rendered
                cy.contains('th', 'Name').should('be.visible');
            });
        });
    });
});

function useMockWidgetFixture(widgetFixturePath: string, widgetId: string, widgetConfiguration?: Record<string, any>) {
    cy.compileScriptFixture(widgetFixturePath).then(compiledScriptSource =>
        cy.interceptWidgetScript(widgetId, compiledScriptSource)
    );
    cy.intercept('GET', '/console/widgets/list', [{ id: widgetId }, { id: 'pluginsCatalog' }]);
    cy.usePageMock(widgetId, widgetConfiguration).mockLogin();
}
