describe('Sites Map', () => {
    const refreshDashboardPage = () => {
        cy.visitPage('Test Page');
    };

    const testSite = { name: 'Tel-Aviv', location: '32.079991, 34.767291' };
    before(() => {
        cy.activate().usePageMock('sitesMap').mockLogin().deleteSites().createSite(testSite).waitUntilLoaded();
    });

    it('is not displayed when there is no connection to map tiles provider', () => {
        cy.intercept('GET', 'maps/0/0/0/', {
            statusCode: 500,
            body: {}
        }).as('mapsRoute');

        refreshDashboardPage();
        cy.get('div.sites-map div.leaflet-layer > div.leaflet-tile-container').should('not.exist');
        cy.get('.sitesMapWidget .ui.message').should('contain.text', 'widget content cannot be displayed');
    });

    it('is displayed when connection to map tiles provider is available', () => {
        refreshDashboardPage();
        cy.get('div.sites-map div.leaflet-layer > div.leaflet-tile-container').should('have.descendants', 'img');
    });

    it('shows markers for each site', () => {
        refreshDashboardPage();
        cy.log('Verify first site is present on the map');
        cy.get('.leaflet-marker-icon').should('have.length', 1).click();
        cy.get('.leaflet-popup .leaflet-popup-content')
            .should('be.visible')
            .find('h5.header')
            .should('have.text', testSite.name);

        cy.log('Add second site');
        const secondSite = { name: 'Bergen', location: '60.389433, 5.332489', visibility: 'private' };
        cy.createSite(secondSite);
        // NOTE: In the CI for some reason refreshDashboardPage does not work here
        cy.reload();

        cy.log('Verify second site is present on the map');
        cy.get('.leaflet-marker-icon').should('have.length', 2);
    });

    it('opens a page showing list of deployments per selected site', () => {
        // NOTE: Do not mock login to load all currently available pages and test drill-down to site
        cy.login();
        cy.get('.leaflet-marker-icon:nth-of-type(1)').click();
        cy.get('.leaflet-popup .leaflet-popup-content').find('.deploymentState').first().click();

        cy.verifyLocation(
            `/console/page/console_deployments/Site:%20${testSite.name}`,
            { siteName: testSite.name },
            `Site: ${testSite.name}`
        );
    });
});
