Cypress.Commands.add('createSite', site => {
    const data = { name: site.name };
    if (site.location) {
        data.location = site.location;
    }
    if (site.visibility) {
        data.visibility = site.visibility;
    }

    cy.cfyRequest(`/sites/${site.name}`, 'PUT', { tenant: 'default_tenant' }, data);
});

Cypress.Commands.add('createSites', sites => {
    for (const site of sites) {
        cy.createSite(site);
    }
});

Cypress.Commands.add('deleteSite', siteName => {
    cy.cfyRequest(`/sites/${siteName}`, 'DELETE', { tenant: 'default_tenant' });
});

Cypress.Commands.add('deleteSites', () => {
    cy.cfyRequest('/sites', 'GET', { tenant: 'default_tenant' }).then(response => {
        for (const site of response.body.items) {
            cy.deleteSite(site.name);
        }
    });
});
