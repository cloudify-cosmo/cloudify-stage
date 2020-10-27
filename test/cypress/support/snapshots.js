Cypress.Commands.add('deleteSnapshot', snapshotName => {
    return cy.cfyRequest(`/snapshots/${snapshotName}`, 'DELETE', null, null, { failOnStatusCode: false });
});
