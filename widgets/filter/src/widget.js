/**
 * Created by kinneretzin on 07/09/2016.
 */

import Filter from './Filter';

Stage.defineWidget({
    id: 'filter',
    name: 'Resource filter',
    description: 'Adds a filter section for resources - blueprints, deployments, nodes, node instances and executions',
    initialWidth: 12,
    initialHeight: 3,
    color: 'yellow',
    showHeader: false,
    showBorder: false,
    hasStyle: true,
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('filter'),
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            id: 'filterByBlueprints',
            name: 'Show blueprint filter',
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'filterByDeployments',
            name: 'Show deployment filter',
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'filterByExecutions',
            name: 'Show execution filter',
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        { id: 'filterByNodes', name: 'Show node filter', default: false, type: Stage.Basic.GenericField.BOOLEAN_TYPE },
        {
            id: 'filterByNodeInstances',
            name: 'Show node instance filter',
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'filterByExecutionsStatus',
            name: 'Show execution status filter',
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'filterBySiteName',
            name: 'Show site name filter',
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'allowMultipleSelection',
            name: 'Allow multiple selection',
            description:
                'Allows selecting more than one blueprint, deployment, node, node instance and execution in the filter',
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ],

    render(widget, data, error, toolbox) {
        return <Filter configuration={widget.configuration} toolbox={toolbox} />;
    }
});
