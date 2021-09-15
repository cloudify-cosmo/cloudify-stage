Cypress.Commands.add('deleteSnapshot', snapshotName =>
    cy.cfyRequest(`/snapshots/${snapshotName}`, 'DELETE', null, null, { failOnStatusCode: false })
);
