describe('Show only my resources widget', () => {
    before(() => cy.activate().login().addWidget('onlyMyResources'));

    it('should render', () => {
        cy.contains('.onlyMyResourcesWidget', 'Show only my resources');
    });
});
