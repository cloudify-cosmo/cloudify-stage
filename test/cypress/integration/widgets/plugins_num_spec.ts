describe('Number of Plugins widget', () => {
    const widgetId = 'pluginsNum';

    function clickOnWidget() {
        cy.get('.pluginsNumWidget .statistic').click();
    }

    function verifyUrl(expectedPageId: string) {
        cy.location('pathname').should('be.equal', `/console/page/${expectedPageId}`);
    }

    before(() => cy.activate('valid_trial_license').mockLogin().addWidget(widgetId));

    it('Opens the default page on click', () => {
        const defaultPage = 'plugins';

        clickOnWidget();
        verifyUrl(defaultPage);
    });

    it('Opens the "testpage" page on click at the widget with customized configuration', () => {
        const page = 'page_0_test';
        const pageId = 'page_0';

        cy.addPage(page).addWidget(widgetId);
        cy.setSearchableDropdownConfigurationField(widgetId, 'Page to open on click', pageId);
        clickOnWidget();

        verifyUrl(pageId);
    });

    it('displays the correct number of plugins', () => {
        cy.stageRequest('/console/sp/plugins', 'GET').then(data => {
            const num = _.get(data.body, 'items', []).length;
            cy.addWidget(widgetId)
                .get('.pluginsNumWidget .value')
                .should($el => expect($el.text().trim()).to.equal(num.toString()));
        });
    });
});
