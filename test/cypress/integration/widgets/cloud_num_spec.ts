describe('Number of clouds widget', () => {
    before(() => cy.activate().usePageMock('cloudNum', { icon: 'cloud' }).mockLogin());

    it('should display configured icon', () => {
        cy.get('.statistic .value i').should('have.class', 'cloud');
    });
});
