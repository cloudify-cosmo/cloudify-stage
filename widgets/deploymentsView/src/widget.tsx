import { mapValues, startCase } from 'lodash';

// NOTE: the order in the array determines the order in the UI
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

interface ColumnDefinition {
    name: string;
    width?: string;
}

const namelessDeploymentsViewColumnDefinitions: Record<DeploymentsViewColumnId, Partial<ColumnDefinition>> = {
    status: {
        // TODO: add tooltip
        width: '5%'
    },
    name: {},
    blueprintName: {},
    environmentType: {},
    location: {},
    subenvironmentsCount: {
        // TODO: add icon
        // TODO: add tooltips for DataTable
        name: 'Subenvironments',
        width: '5%'
    },
    subservicesCount: {
        // TODO: add icon
        name: 'Subservices',
        width: '5%'
    }
};

const deploymentsViewColumnDefinitions: Record<DeploymentsViewColumnId, ColumnDefinition> = mapValues(
    namelessDeploymentsViewColumnDefinitions,
    (columnDefinition, columnId) => ({
        name: startCase(columnId),
        ...columnDefinition
    })
);

interface GridParams {
    _offset: number;
    _size: number;
    _sort: string;
}

// TODO: add a generic type for widget configuration
// TODO: do not define the widget in production (based on process.env.NODE_ENV)

Stage.defineWidget<GridParams, { items: any[]; metadata: any }>({
    id: 'deploymentsView',
    name: 'Deployments view',
    description: 'A complete deployments view – Deployment list, map view, and detailed deployment info',
    initialWidth: 12,
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
                name: deploymentsViewColumnDefinitions[columnId].name,
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

    fetchData(_widget, toolbox, params: GridParams) {
        // TODO: add resolving `filterRules` if they are not fetched (after RD-377)
        return toolbox.getManager().doGet('/deployments', params);
    },

    render(widget, data, _error, toolbox) {
        const { DataTable, Loading } = Stage.Basic;
        const { fieldsToShow, pageSize } = widget.configuration;

        if (Stage.Utils.isEmptyWidgetData(data)) {
            return <Loading />;
        }

        return (
            <DataTable fetchData={toolbox.refresh} pageSize={pageSize}>
                {deploymentsViewColumnIds.map(columnId => (
                    <DataTable.Column
                        key={columnId}
                        name={columnId}
                        label={deploymentsViewColumnDefinitions[columnId].name}
                        width={deploymentsViewColumnDefinitions[columnId].width}
                        show={fieldsToShow.indexOf(columnId) !== -1}
                    />
                ))}

                {/* TODO: add type for deployment */}
                {data.items.map((deployment: any) => (
                    // TODO: add selecting rows
                    <DataTable.Row key={deployment.id}>
                        {/* TODO: add rendering to column configuration */}
                        <DataTable.Data>Status (TODO)</DataTable.Data>
                        <DataTable.Data>{deployment.id}</DataTable.Data>
                        <DataTable.Data>{deployment.blueprint_id}</DataTable.Data>
                        <DataTable.Data>Environment Type (TODO)</DataTable.Data>
                        <DataTable.Data>{deployment.site_name}</DataTable.Data>
                        <DataTable.Data>0 (TODO)</DataTable.Data>
                        <DataTable.Data>0 (TODO)</DataTable.Data>
                    </DataTable.Row>
                ))}
            </DataTable>
        );
    }
});
