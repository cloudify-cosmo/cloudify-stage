import type { PluginsCatalogWidgetConfiguration } from '../../../../widgets/pluginsCatalog/src/types';

describe('Plugins Catalog widget', () => {
    const widgetConfiguration: PluginsCatalogWidgetConfiguration = {
        jsonPath: 'http://repository.cloudifysource.org/cloudify/wagons/plugins.json',
        sortByName: true
    };

    before(() => cy.activate().deletePlugins());

    describe('after uploading the "Utilities" plugin', () => {
        const pluginToUpload = 'Utilities';
        before(() =>
            cy
                .usePageMock(['pluginsCatalog', 'plugins'], widgetConfiguration)
                .mockLogin()
                .uploadPluginFromCatalog(pluginToUpload)
        );

        it('should allow uploading the latest version of a plugin', () => {
            cy.get('.pluginsCatalogWidget table')
                .getTable()
                .then(pluginsCatalogTableRows => {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const pluginCatalogRow = pluginsCatalogTableRows.find(row => row.Name === pluginToUpload)!;
                    expect(pluginCatalogRow).not.to.be.undefined;
                    const latestPluginVersion: string = pluginCatalogRow.Version;

                    cy.log('Verify if plugin is visible in the Plugins widget');
                    cy.get('.pluginsWidget table')
                        .getTable()
                        .then(pluginsTable => {
                            const uploadedPluginRow = pluginsTable.find(row => row.Plugin === pluginToUpload);
                            expect(uploadedPluginRow).not.to.be.undefined;
                            expect(uploadedPluginRow?.['Package version']).to.equal(latestPluginVersion);
                        });

                    expect(pluginCatalogRow['Uploaded version']).to.equal(latestPluginVersion);
                });

            cy.contains('.pluginsCatalogWidget tbody tr', pluginToUpload)
                .find('button[title="Latest version is already uploaded"]')
                .should('exist')
                .and('be.disabled');
        });

        it('should allow uploading the plugin when the uploaded version is different than the latest one', () => {
            const mockPluginVersion = '0.1.0';

            cy.interceptSp('GET', '/plugins?_include=package_name,package_version&package_name=', {
                metadata: { pagination: { total: 1, size: 1000, offset: 0 }, filtered: null },
                items: [
                    {
                        package_name: 'cloudify-utilities-plugin',
                        package_version: mockPluginVersion
                    }
                ]
            }).refreshPage();

            cy.get('.pluginsCatalogWidget table')
                .getTable()
                .then(pluginsCatalogTableRows => {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const pluginCatalogRow = pluginsCatalogTableRows.find(row => row.Name === pluginToUpload)!;
                    expect(pluginCatalogRow).not.to.be.undefined;
                    expect(pluginCatalogRow['Uploaded version']).to.equal(mockPluginVersion);
                    expect(pluginCatalogRow.Version).not.to.equal(pluginCatalogRow['Uploaded version']);
                });

            cy.contains('.pluginsCatalogWidget tbody tr', pluginToUpload)
                .find('button[title="Upload plugin"]')
                .should('exist')
                .and('not.be.disabled');
        });
    });
});
