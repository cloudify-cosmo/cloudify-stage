Cypress.Commands.add('createSite', site => {
    const data = { name: site.name };
    if (site.location) {
        // eslint-disable-next-line scanjs-rules/assign_to_location
        data.location = site.location;
    }
    if (site.visibility) {
        data.visibility = site.visibility;
    }

    cy.cfyRequest(`/sites/${site.name}`, 'PUT', null, data);
});

Cypress.Commands.add('createSites', sites => {
    sites.forEach(site => cy.createSite(site));
});

Cypress.Commands.add('deleteSite', siteName => {
    cy.cfyRequest(`/sites/${siteName}`, 'DELETE');
});

Cypress.Commands.add('deleteSites', (search = '') => {
    cy.cfyRequest(`/sites?_search=${search}`, 'GET').then(response => {
        const sites = response.body.items;
        sites.forEach(site => cy.deleteSite(site.name));
    });
});
