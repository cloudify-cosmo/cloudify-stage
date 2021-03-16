describe('User-defined widgets', () => {
    before(cy.activate);

    describe('Fibonacci sequence widget', () => {
        beforeEach(() => {
            cy.compileScriptFixture('widgets/fibonacciSequenceWidget.tsx').then(compiledScriptSource =>
                cy.interceptWidgetScript('fibonacci-sequence-widget', compiledScriptSource)
            );
        });
        const initialSequence = [1, 1];

        it('render itself once with the initial sequence', () => {
            cy.usePageMock('fibonacci-sequence-widget', { targetSequenceLength: initialSequence.length }).mockLogin();

            cy.contains(`Current sequence: ${JSON.stringify(initialSequence)}`);
        });

        it('render itself recursively with intermediate sequences', () => {
            const sequence = [1, 1, 2, 3, 5, 8, 13, 21, 34];
            cy.usePageMock('fibonacci-sequence-widget', { targetSequenceLength: sequence.length }).mockLogin();
            const initialSequenceLength = initialSequence.length;

            Array.from({ length: sequence.length - initialSequenceLength }).forEach((_, index) => {
                cy.contains(`Current sequence: ${JSON.stringify(sequence.slice(0, initialSequenceLength + index))}`);
            });
        });
    });

    describe('Split view widget', () => {
        beforeEach(() => {
            cy.compileScriptFixture('widgets/splitViewWidget.tsx').then(compiledScriptSource =>
                cy.interceptWidgetScript('split-view-widget', compiledScriptSource)
            );
        });

        it('should render itself and the nested Plugins Catalog widget', () => {
            cy.usePageMock('split-view-widget').mockLogin();

            cy.contains('Content on the left');
            cy.contains('Content on the right');
            cy.contains('Plugins Catalog');
            // NOTE: make sure the content of the widget is rendered
            cy.get('th').contains('Name');
        });
    });
});
