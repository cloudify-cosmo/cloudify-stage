describe('Number of Plugins widget', () => {
    const widgetId = 'pluginsNum';
    const page = 'page_0_test';
    const pageId = 'page_0';

    function clickOnWidget() {
        cy.getWidget(widgetId).find('.statistic').click();
    }

    before(() => cy.activate('valid_trial_license').mockLogin().addPage(page).addWidget(widgetId));

    it('opens the default page on click', () => {
        const defaultPage = 'plugins';

        clickOnWidget();
        cy.verifyLocationByPageId(defaultPage);
    });

    describe('', () => {
        beforeEach(() => {
            cy.visitPage(pageId);
        });

        it('displays the correct number of plugins', () => {
            cy.stageRequest('/console/sp/plugins', 'GET').then(data => {
                const num = _.get(data.body, 'items', []).length;
                cy.getWidget(widgetId)
                    .find('.value')
                    .should($el => expect($el.text().trim()).to.equal(num.toString()));
            });
        });

        it('opens the "testpage" page on click at the widget with customized configuration', () => {
            cy.setSearchableDropdownConfigurationField(widgetId, 'Page to open on click', pageId);
            clickOnWidget();

            cy.verifyLocationByPageId(pageId);
        });
    });
});
