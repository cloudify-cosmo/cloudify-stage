/**
 * Created by jakub.niezgoda on 25/10/2018.
 */

import ManagersTable from './ManagersTable';

Stage.defineWidget({
    id: 'managers',
    name: 'Spire Manager',
    description: 'This widget allows to manage Managers created using Spire plugin',
    initialWidth: 12,
    initialHeight: 24,
    color: 'black',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('managers'),
    categories: [Stage.GenericConfig.CATEGORY.SPIRE],
    supportedEditions: [Stage.Common.Consts.licenseEdition.spire],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'fieldsToShow',
            name: 'List of fields to show in the table',
            placeHolder: 'Select fields from the list',
            items: ['Deployment', 'IP', 'Last Execution', 'Status', 'Actions'],
            default: 'Deployment,IP,Last Execution,Status,Actions',
            type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
        }
    ],

    fetchData(widget, toolbox) {
        return toolbox.getWidgetBackend().doGet('get_spire_deployments');
    },

    render(widget, data, error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        return <ManagersTable widget={widget} data={data} toolbox={toolbox} />;
    }
});
