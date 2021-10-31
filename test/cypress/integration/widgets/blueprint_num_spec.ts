describe('Number of Blueprints widget', () => {
    const widgetId = 'blueprintNum';

    before(() => cy.activate().useWidgetWithDefaultConfiguration(widgetId, { pollingTime: 3 }));

    it('displays the correct number of resources', () => {
        cy.stageRequest('/console/sp/blueprints', 'GET').then(data => {
            const num = _.get(data.body, 'metadata.pagination.total', 0);
            cy.get('.blueprintNumWidget .value').should($el => expect($el.text().trim()).to.equal(num.toString()));
        });
    });

    it('opens default page on click', () => {
        // TODO
    });

    it('opens chosen page after configuration change on click', () => {
        // TODO
    });
});
