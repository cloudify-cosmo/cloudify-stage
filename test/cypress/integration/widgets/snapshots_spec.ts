describe('Snapshots list widget', () => {
    const createdSnapshotName = 'snapshots_test_created';
    const uploadedSnapshotName = 'snapshots_test_uploaded';

    before(() =>
        cy
            .activate('valid_trial_license')
            .usePageMock('snapshots', { pollingTime: 5 })
            .deletePlugins()
            .deleteSnapshot(createdSnapshotName)
            .deleteSnapshot(uploadedSnapshotName)
            .killRunningExecutions()
            .mockLogin()
    );

    it('should allow to create and delete a snapshot', () => {
        cy.contains('Create').click();
        cy.get('.modal').within(() => {
            cy.get('input[type=text]').type(createdSnapshotName);
            cy.clickButton('Create');
        });
        cy.contains('.snapshotsWidget tr', createdSnapshotName).within(() => {
            cy.contains('creating');
            cy.get('.trash.disabled');
            cy.waitUntilNotEmpty(`snapshots?_include=id,status&id=${createdSnapshotName}&status=created`);
            cy.contains('creating').should('not.exist');
            cy.get('.trash').click();
        });
        cy.contains('Yes').click();
        cy.contains('.snapshotsWidget tr', createdSnapshotName).should('not.exist');
    });

    it('should allow to upload and restore a snapshot', () => {
        cy.contains('Upload').click();
        cy.get('.modal').within(() => {
            cy.clickButton('Upload');
            cy.contains('Please select snapshot file or url');
            cy.contains('Please provide snapshot ID');

            cy.get('input[name=snapshotUrl]').type('bad url');
            cy.clickButton('Upload');
            cy.contains('Please provide valid URL for snapshot');

            cy.get('input[name=snapshotUrl]').clear();
            cy.get('input[name=snapshotFile]').attachFile('snapshots/empty.zip');
            cy.get('input[name=snapshotId]').type(uploadedSnapshotName);
            cy.clickButton('Upload');
        });
        cy.contains('.snapshotsWidget tr', uploadedSnapshotName).within(() => {
            cy.contains('uploaded');
            cy.get('.undo').click();
        });
        cy.contains('button', 'Restore').click();
        cy.contains('.modal').should('not.exist');
    });
});
