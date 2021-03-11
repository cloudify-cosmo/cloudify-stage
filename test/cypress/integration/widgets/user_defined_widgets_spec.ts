describe('User-defined widgets', () => {
    describe('Fibonacci sequence widget', () => {
        before(cy.activate);

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
});
