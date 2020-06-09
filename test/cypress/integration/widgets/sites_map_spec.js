describe('Sites Map', () => {
    const reloadDashboardPage = () => {
        cy.get('.dashboardPageMenuItem.active').click();
        cy.get('.sitesMapWidget .ui.text.loader').should('not.be.visible');
    };

    before(() => {
        const testSite = { name: 'Tel-Aviv', location: '32.079991, 34.767291' };

        cy.activate('valid_spire_license')
            .login()
            .deleteSites()
            .createSite(testSite)
            .waitUntilLoaded();
    });

    it('is not displayed when there is no connection to map tiles provider', () => {
        cy.server();
        cy.route({
            method: 'GET',
            url: /maps\/0\/0\/0\//,
            status: 500,
            response: {}
        }).as('mapsRoute');

        reloadDashboardPage();
        cy.get('div.sites-map div.leaflet-layer > div.leaflet-tile-container').should('not.have.descendants', 'img');
        cy.get('.sitesMapWidget .ui.message').should('contain.text', 'widget content cannot be displayed');
    });

    it('is displayed when connection to map tiles provider is available', () => {
        reloadDashboardPage();
        cy.get('div.sites-map div.leaflet-layer > div.leaflet-tile-container').should('have.descendants', 'img');
    });

    it('shows markers for each site', () => {
        reloadDashboardPage();
        // Verify first site is present on the map
        cy.get('.leaflet-marker-icon')
            .should('have.length', 1)
            .click();
        cy.get('.leaflet-popup .leaflet-popup-content').should('be.visible');
        cy.get('.leaflet-popup .leaflet-popup-content h5.header').should('have.text', 'Tel-Aviv');

        // Add second site
        const secondSite = { name: 'Bergen', location: '60.389433, 5.332489', visibility: 'private' };
        cy.createSite(secondSite);
        reloadDashboardPage();

        // Verify second site is present on the map
        cy.get('.leaflet-marker-icon').should('have.length', 2);
    });
});
