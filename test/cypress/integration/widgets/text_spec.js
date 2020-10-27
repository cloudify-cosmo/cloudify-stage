describe('Text box widget', () => {
    before(() => cy.activate('valid_trial_license').login().addWidget('text'));

    it('should render', () => {
        cy.contains('Header text');
        cy.contains('Markdown supported content. Update in widget configuration.');
    });
});
