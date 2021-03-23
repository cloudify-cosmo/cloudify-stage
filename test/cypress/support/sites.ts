Cypress.Commands.add('createSite', site => {
    const data: any = { name: site.name };
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
    sites.forEach((cy as any).createSite);
});

Cypress.Commands.add('deleteSite', siteName => {
    cy.cfyRequest(`/sites/${siteName}`, 'DELETE');
});

Cypress.Commands.add('deleteSites', (search = '') => {
    cy.cfyRequest(`/sites?_search=${search}`, 'GET').then(response => {
        const sites = response.body.items;
        sites.forEach((site: any) => (cy as any).deleteSite(site.name));
    });
});
