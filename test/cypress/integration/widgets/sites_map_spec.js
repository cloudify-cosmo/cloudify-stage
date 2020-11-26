describe('Sites Map', () => {
    const refreshDashboardPage = () => {
        cy.visitPage('Test Page');
    };

    const testSite = { name: 'Tel-Aviv', location: '32.079991, 34.767291' };
    before(() => {
        cy.activate('valid_spire_license')
            .usePageMock('sitesMap')
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

        refreshDashboardPage();
        cy.get('div.sites-map div.leaflet-layer > div.leaflet-tile-container').should('not.have.descendants', 'img');
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
            .within(() => {
                cy.get('h5.header').should('have.text', testSite.name).click();
                cy.get('.deploymentState').first().click();
            });
        cy.location('pathname').should('be.equal', '/console/page/deployments');
        cy.location('search').then(queryString =>
            expect(JSON.parse(new URLSearchParams(queryString).get('c'))).to.deep.equal([
                { context: { siteName: testSite.name } }
            ])
        );

        cy.log('Add second site');
        const secondSite = { name: 'Bergen', location: '60.389433, 5.332489', visibility: 'private' };
        cy.createSite(secondSite);
        refreshDashboardPage();

        cy.log('Verify second site is present on the map');
        cy.get('.leaflet-marker-icon').should('have.length', 2);
    });
});
