describe('Sites Map', () => {
    const testSite = { name: 'Tel-Aviv', location: '32.079991, 34.767291' };

    function refreshPage() {
        cy.clickSidebarItem('Dashboard');
    }

    before(() => {
        cy.activate().deleteSites().login();
    });

    it('is not displayed when there is no connection to map tiles provider', () => {
        cy.intercept('GET', '/console/maps/0/0/0/*', {
            statusCode: 500,
            body: {}
        }).as('mapsRoute');

        refreshPage();
        cy.wait('@mapsRoute');
        cy.get('div.sites-map div.leaflet-layer > div.leaflet-tile-container').should('not.exist');
        cy.get('.sitesMapWidget .ui.message').should('contain.text', 'widget content cannot be displayed');
    });

    it('is displayed when there are no sites defined', () => {
        refreshPage();

        cy.contains(
            'This widget shares site location and status info. There is no data to display because no sites are defined. Sites can be added in the Sites page.'
        );
        cy.contains('Sites page').click();
        cy.contains('.pageTitle', 'Sites');
    });

    describe('is displayed when sites are available and', () => {
        before(() => {
            cy.createSite(testSite);
            refreshPage();
        });

        it('shows markers for each site', () => {
            cy.get('div.sites-map div.leaflet-layer > div.leaflet-tile-container').should('have.descendants', 'img');

            cy.log('Verify first site is present on the map');
            cy.get('.leaflet-marker-icon').should('have.length', 1).click();
            cy.get('.leaflet-popup .leaflet-popup-content')
                .should('be.visible')
                .find('h5.header')
                .should('have.text', testSite.name);

            cy.log('Add second site');
            const secondSite = { name: 'Bergen', location: '60.389433, 5.332489', visibility: 'private' };
            cy.createSite(secondSite);

            cy.refreshTemplate();

            cy.log('Verify second site is present on the map');
            cy.get('.leaflet-marker-icon').should('have.length', 2);
        });

        it('opens a page showing list of deployments per selected site', () => {
            cy.get('.leaflet-marker-icon:nth-of-type(1)').click();
            cy.get('.leaflet-popup .leaflet-popup-content').find('.deploymentState').first().click();

            cy.verifyLocation(
                `/console/page/dashboard_deployments/Site:%20${testSite.name}`,
                { siteName: testSite.name },
                `Site: ${testSite.name}`
            );
        });
    });
});
