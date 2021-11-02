describe('Number of Blueprints widget', () => {
    const widgetId = 'blueprintNum';
    const defaultPageName = 'Blueprints';
    const defaultPageId = 'blueprints';

    before(() => cy.activate().useWidgetWithDefaultConfiguration(widgetId, { pollingTime: 3 }));

    beforeEach(() => cy.visitTestPage());

    it('displays the correct number of resources', () => {
        cy.stageRequest('/console/sp/blueprints', 'GET').then(data => {
            const num = _.get(data.body, 'metadata.pagination.total', 0);
            cy.get('.blueprintNumWidget .value').should($el => expect($el.text().trim()).to.equal(num.toString()));
        });
    });

    describe('opens the correct page on click', () => {
        const pageName = 'Environments';
        const pageId = 'page_1';
        before(() => {
            cy.addPage(defaultPageName);
            cy.addPage(pageName);
        });

        function setWidgetConfiguration(pageToOpenOnClick: string) {
            cy.editWidgetConfiguration(widgetId, () => {
                cy.setSingleDropdownValue('Page to open on click', pageToOpenOnClick);
            });
        }

        function clickOnWidget() {
            cy.get('.statistic').click();
        }

        function verifyUrl(expectedPageId: string) {
            cy.location('pathname').should('be.equal', `/console/page/${expectedPageId}`);
        }

        it('opens page according to the default configuration', () => {
            clickOnWidget();
            verifyUrl(defaultPageId);
        });

        it('opens chosen page after configuration change on click', () => {
            setWidgetConfiguration(pageName);
            clickOnWidget();
            verifyUrl(pageId);
        });
    });
});
