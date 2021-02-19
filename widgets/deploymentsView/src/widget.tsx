import { startCase } from 'lodash';

const deploymentsViewColumnIds = [
    'status',
    'name',
    'blueprintName',
    'environmentType',
    'location',
    'subenvironmentsCount',
    'subservicesCount'
] as const;

type DeploymentsViewColumnId = typeof deploymentsViewColumnIds[number];

const deploymentsViewColumnNames = deploymentsViewColumnIds.reduce((names, columnId) => {
    names[columnId] = startCase(columnId);
    return names;
}, {} as Record<DeploymentsViewColumnId, string>);

Stage.defineWidget({
    id: 'deploymentsView',
    name: 'Deployments view',
    description: 'A complete deployments view – Deployment list, map view, and detailed deployment info',
    initialWidth: 8,
    initialHeight: 24, // TODO: adjust height
    color: 'purple',
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {
            // TODO: Requires RD-377 to add support for filters
            id: 'filterId',
            type: Stage.Basic.GenericField.STRING_TYPE,
            name: 'Name of the saved filter to apply'
        },
        {
            id: 'filterByParentDeployment',
            type: Stage.Basic.GenericField.BOOLEAN_TYPE,
            name: 'Filter by parent deployment',
            description:
                'Only show deployments directly attached to the deployment selected on the previous page (when in drill-down).',
            default: false
        },
        // TODO(RD-1225): add map configuration
        {
            id: 'fieldsToShow',
            name: 'List of fields to show in the table',
            placeHolder: 'Select fields from the list',
            items: deploymentsViewColumnIds.map(columnId => ({
                name: deploymentsViewColumnNames[columnId],
                value: columnId
            })),
            default: Object.values(deploymentsViewColumnIds).filter(columnId => columnId !== 'environmentType'),
            type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
        },
        Stage.GenericConfig.PAGE_SIZE_CONFIG(100),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
    ],
    isReact: true,
    hasReadme: true,
    hasStyle: false,
    // TODO: use a new permissions config
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deployments'),

    render() {
        return <div>Hello world</div>;
    }
});
