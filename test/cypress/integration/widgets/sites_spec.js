describe('Sites Management', () => {
    const siteWithLocation = { name: 'Tel-Aviv', location: '32.079991, 34.767291' };
    const siteWithNoLocation = { name: 'London' };
    const siteWithPrivateVisibility = {
        name: 'Rome',
        location: '41.910385, 12.476267',
        visibility: 'private'
    };
    const sites = [siteWithNoLocation, siteWithPrivateVisibility, siteWithLocation];

    const siteWithInvalidName = {
        name: ':name',
        error: 'The `name` argument contains illegal characters.',
        check: 'the name is invalid'
    };
    const siteWithInvalidLocation = {
        name: 'Miami',
        location: 'a',
        error: 'Invalid location `a`',
        check: 'the location is invalid'
    };
    const siteAlreadyExists = { name: 'Tel-Aviv', error: 'already exists', check: 'it already exists' };
    const invalidSites = [siteWithInvalidName, siteWithInvalidLocation, siteAlreadyExists];

    const reloadSiteManagementPage = () => {
        cy.visitPage('Site Management');
        cy.get('.sitesWidget .ui.text.loader').should('not.be.visible');
    };

    const createSite = site => {
        cy.get('.actionField > .ui').as('createSiteButton');
        cy.get('@createSiteButton').click();

        cy.get('.required > .field > .ui > input').as('name');
        cy.get(':nth-child(3) > .field > .ui > input').as('location');
        cy.get('.actions > .green').as('createButton');
        cy.get('.modal > :nth-child(1) > .green').as('visibility');

        cy.get('@name')
            .type(site.name)
            .should('have.value', site.name);

        if (site.location) {
            cy.get('@location')
                .type(site.location)
                .should('have.value', site.location);
        }

        cy.get('@createButton').click();
    };

    const createValidSite = site => {
        createSite(site);
        cy.get('.modal').should('not.be.visible', true);
    };

    const createInvalidSite = site => {
        if (site.error === 'already exists') {
            cy.createSite(siteWithLocation);
        }
        createSite(site);

        // Verify error
        cy.get('.form > .error').should('be.visible', true);
        cy.get('.list > .content').contains(site.error);

        // Close modal
        cy.get('.actions > .basic').as('cancelButton');
        cy.get('@cancelButton').click();
    };

    const verifySiteRow = (index, site) => {
        const siteRow = `tbody > :nth-child(${index})`;
        cy.get(`${siteRow} > :nth-child(1)`).should('have.text', site.name);

        let visibilityColor = 'green';
        if (site.visibility === 'private') {
            visibilityColor = 'red';
        }
        cy.get(`${siteRow} > :nth-child(1) > span > .${visibilityColor}`).should('be.visible', true);

        if (site.location) {
            const [latitude, longitude] = site.location.split(',');
            cy.get(`${siteRow} > :nth-child(2)`).should('have.text', `Latitude: ${latitude}, Longitude: ${longitude}`);
            cy.get(`${siteRow} > :nth-child(2) i`).trigger('mouseover');
            cy.get('.popup .leaflet-marker-icon').should('have.length', 1);
            cy.get(`${siteRow} > :nth-child(2) i`).trigger('mouseout');
            cy.get('.popup').should('not.exist');
        } else {
            cy.get(`${siteRow} > :nth-child(2)`).should('have.text', '');
            cy.get(`${siteRow} > :nth-child(2) i`).should('not.exist');
        }

        cy.get(`${siteRow} > :nth-child(5)`).should('have.text', 'default_tenant');
        cy.get(`${siteRow} > :nth-child(6)`).should('have.text', '0');
    };

    const deleteSite = index => {
        const deleteButton = `:nth-child(${index}) > .center > .trash`;
        cy.get(deleteButton).click();

        // Click the Yes button
        cy.get('.primary').click();
    };

    before(() => {
        cy.activate('valid_spire_license')
            .deleteAllUsersAndTenants()
            .login()
            .visit('/console/page/site_management')
            .waitUntilLoaded();
    });

    beforeEach(() => {
        cy.deleteSites();
        reloadSiteManagementPage();
    });

    it('create new site with location', () => {
        createValidSite(siteWithLocation);
    });

    it('create new site with no location', () => {
        createValidSite(siteWithNoLocation);
    });

    it('create new site with private visibility using map', () => {
        cy.get('.actionField > .ui').click();

        const name = 'Rome';
        cy.get('.required > .field > .ui > input').type(name);

        // use map to specify location
        cy.get(':nth-child(3) > .field > .ui > button').click();
        cy.get('.leaflet-container').click();
        cy.get(':nth-child(3) > .field > .ui > input').should('have.value', '0.08789059053082422, 0');

        // change visibility
        cy.get('.modal > :nth-child(1) > .green').click();

        // submit
        cy.get('.actions > .green').click();

        verifySiteRow(1, { name, location: '0.0878905905308242, 0.0', visibility: 'private' });
    });

    invalidSites.forEach(site => {
        it(`create site fails when ${site.check}`, () => {
            createInvalidSite(site);
        });
    });

    it('list all sites', () => {
        cy.createSites(sites);
        reloadSiteManagementPage();

        cy.get('.sitesWidget').should('be.visible', true);

        for (let i = 0; i < sites.length; i += 1) {
            verifySiteRow(i + 1, sites[i]);
        }
    });

    it('update a site with location changed with text input', () => {
        cy.createSite(siteWithLocation);
        reloadSiteManagementPage();

        cy.get('.edit').click();
        cy.get(':nth-child(2) > .field > .ui > input').as('name');
        cy.get(':nth-child(3) > .field > .ui > input').as('location');

        const newName = 'new_name';
        cy.get('@name')
            .clear()
            .type(newName)
            .should('have.value', newName);

        cy.get('@location').clear();

        // Click update
        cy.get('.actions > .green').click();

        verifySiteRow(1, { name: newName, location: '' });
    });

    it('update a site with location changed with map', () => {
        cy.createSite(siteWithLocation);
        reloadSiteManagementPage();

        cy.get('.edit').click();

        cy.get(':nth-child(3) > .field > .ui > button').click();
        cy.get('.leaflet-container').click();

        cy.get(':nth-child(3) > .field > .ui > input').should('have.value', '32.175612478499346, 34.80468750000001');

        // Click update
        cy.get('.actions > .green').click();

        verifySiteRow(1, { name: siteWithLocation.name, location: '32.1756124784993, 34.8046875' });
    });

    it('update the visibility of a site', () => {
        cy.createSite(siteWithPrivateVisibility);
        reloadSiteManagementPage();

        // Change the visibility to tenant
        cy.get('.red.lock').click();
        cy.get('.green > .visible').click();
        cy.get('.primary').click();

        verifySiteRow(1, { ...siteWithPrivateVisibility, visibility: 'tenant' });
    });

    it('cancel site delete', () => {
        cy.createSite(siteWithLocation);
        reloadSiteManagementPage();

        cy.get('.trash').click();

        // Click the No button
        cy.get('.actions > :nth-child(1)').click();
    });

    it('delete all sites', () => {
        cy.createSites(sites);
        reloadSiteManagementPage();

        for (let i = sites.length; i > 0; i -= 1) {
            deleteSite(i);
        }

        // No sites message
        cy.get('.center > span').should('have.text', 'There are no Sites available. Click "Create" to create Sites.');
    });
});
