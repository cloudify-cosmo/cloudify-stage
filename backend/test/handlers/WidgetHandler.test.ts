// @ts-nocheck File not migrated fully to TS
import mkdirp from 'mkdirp';
import { getResourcePath } from 'utils';
import { listWidgets } from 'handler/WidgetsHandler';

jest.mock('handler/ManagerHandler');

describe('WidgetHandler', () => {
    it('allows to list all widgets', async () => {
        const userWidgetsFolder = getResourcePath('widgets', true);
        mkdirp.sync(userWidgetsFolder);
        await expect(listWidgets()).resolves.toEqual([
            { id: 'agents', isCustom: false },
            { id: 'blueprintActionButtons', isCustom: false },
            { id: 'blueprintCatalog', isCustom: false },
            { id: 'blueprintInfo', isCustom: false },
            { id: 'blueprintNum', isCustom: false },
            { id: 'blueprintSources', isCustom: false },
            { id: 'blueprintUploadButton', isCustom: false },
            { id: 'blueprints', isCustom: false },
            { id: 'buttonLink', isCustom: false },
            { id: 'cloudNum', isCustom: false },
            { id: 'composerLink', isCustom: false },
            { id: 'deploymentActionButtons', isCustom: false },
            { id: 'deploymentButton', isCustom: false },
            { id: 'deploymentInfo', isCustom: false },
            { id: 'deploymentNum', isCustom: false },
            { id: 'deploymentWizardButtons', isCustom: false },
            { id: 'deployments', isCustom: false },
            { id: 'deploymentsView', isCustom: false },
            { id: 'deploymentsViewDrilledDown', isCustom: false },
            { id: 'events', isCustom: false },
            { id: 'eventsFilter', isCustom: false },
            { id: 'executionNum', isCustom: false },
            { id: 'executions', isCustom: false },
            { id: 'executionsStatus', isCustom: false },
            { id: 'filter', isCustom: false },
            { id: 'filters', isCustom: false },
            { id: 'highAvailability', isCustom: false },
            { id: 'inputs', isCustom: false },
            { id: 'labels', isCustom: false },
            { id: 'maintenanceModeButton', isCustom: false },
            { id: 'managers', isCustom: false },
            { id: 'nodes', isCustom: false },
            { id: 'nodesComputeNum', isCustom: false },
            { id: 'nodesStats', isCustom: false },
            { id: 'onlyMyResources', isCustom: false },
            { id: 'outputs', isCustom: false },
            { id: 'pluginUploadButton', isCustom: false },
            { id: 'plugins', isCustom: false },
            { id: 'pluginsCatalog', isCustom: false },
            { id: 'pluginsNum', isCustom: false },
            { id: 'secrets', isCustom: false },
            { id: 'serversNum', isCustom: false },
            { id: 'serviceButton', isCustom: false },
            { id: 'sites', isCustom: false },
            { id: 'sitesMap', isCustom: false },
            { id: 'snapshots', isCustom: false },
            { id: 'tenants', isCustom: false },
            { id: 'text', isCustom: false },
            { id: 'tokens', isCustom: false },
            { id: 'topology', isCustom: false },
            { id: 'userGroups', isCustom: false },
            { id: 'userManagement', isCustom: false }
        ]);
    });
});
