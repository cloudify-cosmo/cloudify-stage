import type { PluginsCatalogWidgetConfiguration } from '../../../../widgets/pluginsCatalog/src/types';
import { minutesToMs } from '../../support/resource_commons';

const uploadPluginTimeout = minutesToMs(2);

function uploadPlugins(pluginNames: string[]) {
    pluginNames.forEach(pluginName => {
        // eslint-disable-next-line security/detect-non-literal-regexp
        cy.intercept('POST', new RegExp(`console/plugins/upload.*title=${pluginName}`)).as(pluginName);

        cy.log(`Upload ${pluginName} plugin`);

        cy.contains('.pluginsCatalogWidget tr', pluginName).find('button').click();
    });

    pluginNames.forEach(pluginName => {
        cy.wait(`@${pluginName}`, { responseTimeout: uploadPluginTimeout });
        cy.contains('.pluginsCatalogWidget .message', `${pluginName} successfully uploaded`);
    });
}

describe('Plugins Catalog widget', () => {
    const widgetConfiguration: PluginsCatalogWidgetConfiguration = {
        jsonPath: 'http://repository.cloudifysource.org/cloudify/wagons/v2_plugins.json',
        sortByName: true
    };

    before(() =>
        cy.activate().deletePlugins().usePageMock(['pluginsCatalog', 'plugins'], widgetConfiguration).mockLogin()
    );

    it('should allow uploading multiple plugins', () => {
        const pluginsToUpload = ['Helm', 'Libvirt'];
        uploadPlugins(pluginsToUpload);
        pluginsToUpload.forEach(pluginToUpload => {
            cy.get('.pluginsCatalogWidget table')
                .getTable()
                .then(pluginsCatalogTableRows => {
                    const pluginCatalogRow = pluginsCatalogTableRows.find(row => row.Name === pluginToUpload)!;
                    expect(pluginCatalogRow).not.to.be.undefined;
                    const latestPluginVersion: string = pluginCatalogRow.Version;

                    cy.log('Verify if plugin is visible in the Plugins widget');
                    cy.contains('.pluginsWidget table tr', pluginToUpload).contains(latestPluginVersion);

                    cy.contains('.pluginsCatalogWidget table tr', pluginToUpload).contains(
                        'td:nth-child(5)',
                        latestPluginVersion
                    );
                });

            cy.contains('.pluginsCatalogWidget tbody tr', pluginToUpload)
                .find('button[title="Latest version is already uploaded"]')
                .should('exist')
                .and('be.disabled');
        });
    });

    it('should allow uploading the plugin when the uploaded version is different than the latest one', () => {
        const pluginToUpload = 'Utilities';
        const mockPluginVersion = '0.1.0';

        cy.interceptSp(
            'GET',
            { pathname: '/plugins', query: { _include: 'package_name,package_version', package_name: '*' } },
            {
                metadata: { pagination: { total: 1, size: 1000, offset: 0 }, filtered: null },
                items: [
                    {
                        package_name: 'cloudify-utilities-plugin',
                        package_version: mockPluginVersion
                    }
                ]
            }
        ).refreshPage();

        cy.get('.pluginsCatalogWidget table')
            .getTable()
            .then(pluginsCatalogTableRows => {
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

    it('should refresh the uploaded version when the plugin is removed', () => {
        const pluginToUpload = 'HOST-POOL';
        uploadPlugins([pluginToUpload]);
        cy.contains('.pluginsTable tbody tr', pluginToUpload).find('i[title="Delete"]').click();
        cy.get('.modal').within(() => {
            // NOTE: force removal, as there is some dependency between test suites that prevents regular removal
            cy.contains('.checkbox', 'Force').find('input[type="checkbox"]').click({ force: true });
            cy.contains('button', 'Yes').click();
        });
        cy.get('.modal').should('not.exist');

        const uploadedVersionColumnNumber = 5;
        // NOTE: manually query for the specific column to use Cypress' retries.
        // Using `getTable` did not retry
        cy.contains('.pluginsCatalogWidget tr', pluginToUpload).contains(
            `td:nth-of-type(${uploadedVersionColumnNumber})`,
            '-'
        );
    });

    it('should upload all plugins', () => {
        // eslint-disable-next-line security/detect-non-literal-regexp
        cy.intercept('POST', new RegExp(`console/plugins/upload.*title=AWS`)).as('awsPluginUpload');
        cy.contains('Upload all plugins').click().should('be.disabled');
        cy.get('.pluginsCatalogWidget tr button').should('be.disabled');

        // intercept for the second plugin is installed later to check upload timing
        // eslint-disable-next-line security/detect-non-literal-regexp
        cy.intercept('POST', new RegExp(`console/plugins/upload.*title=Ansible`)).as('ansiblePluginUpload');
        cy.wait('@awsPluginUpload', { responseTimeout: uploadPluginTimeout });

        cy.contains('AWS successfully uploaded');
        cy.contains('.pluginsCatalogWidget tr', 'AWS').find('button.loading').should('not.exist');
        cy.get('.pluginsCatalogWidget table')
            .getTable()
            .then(pluginsCatalogTableRows => {
                const pluginCatalogRow = pluginsCatalogTableRows.find(row => row.Name === 'AWS')!;
                expect(pluginCatalogRow).not.to.be.undefined;
                const latestPluginVersion: string = pluginCatalogRow.Version;
                expect(pluginCatalogRow['Uploaded version']).to.equal(latestPluginVersion);
            });

        cy.wait('@ansiblePluginUpload', { responseTimeout: uploadPluginTimeout });
    });
});
