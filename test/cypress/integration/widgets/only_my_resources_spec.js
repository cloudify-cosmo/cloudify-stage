describe('Show only my resources widget', () => {
    before(() => cy.activate().usePageMock('onlyMyResources').mockLogin());

    it('should render', () => {
        cy.contains('.onlyMyResourcesWidget', 'Show only my resources');
    });
});
