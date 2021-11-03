describe('Number of Blueprints widget', () => {
    const widgetId = 'blueprintNum';

    function clickOnWidget() {
        cy.get('.statistic').click();
    }

    function verifyUrl(expectedPageId: string) {
        cy.location('pathname').should('be.equal', `/console/page/${expectedPageId}`);
    }

    function setWidgetConfiguration(pageToOpenOnClick: string) {
        cy.editWidgetConfiguration(widgetId, () => {
            cy.setSingleDropdownValue('Page to open on click', pageToOpenOnClick);
        });
    }

    describe('Tests without mockLogin', () => {
        before(() => cy.activate().login().addWidget(widgetId));
        
        it('Opens the default page on click', () => {
            clickOnWidget();
            verifyUrl('blueprints');
        });
    });

    describe('Tests with mockLogin', () => {
        const pageName = 'Environments';
        const pageId = 'page_0';
    
        before(() => {
            cy.activate().useWidgetWithDefaultConfiguration(widgetId, { pollingTime: 3 });
            cy.addPage(pageName);
        });
    
        beforeEach(() => cy.visitTestPage());
    
        it('displays the correct number of resources', () => {
            cy.stageRequest('/console/sp/blueprints', 'GET').then(data => {
                const num = _.get(data.body, 'metadata.pagination.total', 0);
                cy.get('.blueprintNumWidget .value').should($el => expect($el.text().trim()).to.equal(num.toString()));
            });
        });

        it('opens chosen page after configuration change on click', () => {
            setWidgetConfiguration(pageName);
            clickOnWidget();
            verifyUrl(pageId);
        });
    });
});
