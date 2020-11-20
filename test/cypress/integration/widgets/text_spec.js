describe('Text box widget', () => {
    const header = 'Header text';
    const content = 'Content text';

    before(() => cy.activate('valid_trial_license').usePageMock('text', { header, content }).login());

    it('should render', () => {
        cy.contains(header);
        cy.contains(content);
    });
});
