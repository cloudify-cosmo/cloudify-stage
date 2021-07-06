import type { PluginsCatalogWidgetConfiguration } from '../../../../widgets/pluginsCatalog/src/types';

describe('Plugins Catalog widget', () => {
    const widgetConfiguration: PluginsCatalogWidgetConfiguration = {
        jsonPath: 'http://repository.cloudifysource.org/cloudify/wagons/plugins.json',
        sortByName: true
    };

    before(() => cy.activate());
    beforeEach(() => cy.deletePlugins().usePageMock(['pluginsCatalog', 'plugins'], widgetConfiguration).mockLogin());

    it('should allow uploading the latest version of a plugin', () => {
        const pluginToUpload = 'Utilities';
        cy.uploadPluginFromCatalog(pluginToUpload);

        cy.get('.pluginsCatalogWidget table')
            .getTable()
            .then(pluginsCatalogTable => {
                const pluginCatalogRow = pluginsCatalogTable.find(row => row.Name === pluginToUpload);
                expect(pluginCatalogRow).not.to.be.undefined;
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const latestPluginVersion: string = pluginCatalogRow!.Version;

                cy.log('Verify if plugin is visible in the Plugins widget');
                cy.get('.pluginsWidget table')
                    .getTable()
                    .then(pluginsTable => {
                        const uploadedPluginRow = pluginsTable.find(row => row.Plugin === pluginToUpload);
                        expect(uploadedPluginRow).not.to.be.undefined;
                        expect(uploadedPluginRow?.['Package version']).to.equal(latestPluginVersion);
                    });
            });
    });
});
