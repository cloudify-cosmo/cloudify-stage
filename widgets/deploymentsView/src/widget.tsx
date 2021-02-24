import { deploymentsViewColumnDefinitions, DeploymentsViewColumnId, deploymentsViewColumnIds } from './columns';
import renderDeploymentRow from './renderDeploymentRow';

interface GridParams {
    _offset: number;
    _size: number;
    _sort: string;
}

interface DeploymentsResponse {
    items: any[];
    metadata: any;
}

interface DeploymentsViewWidgetConfiguration {
    filterId?: string;
    filterByParentDeployment: boolean;
    fieldsToShow: DeploymentsViewColumnId[];
    pageSize: number;
    sortColumn: string;
    sortAscending: string;
}

// TODO(RD-1224): remove environment check
if (process.env.NODE_ENV === 'development') {
    Stage.defineWidget<GridParams, DeploymentsResponse, DeploymentsViewWidgetConfiguration>({
        id: 'deploymentsView',
        name: 'Deployments view',
        description: 'A complete deployments view – Deployment list, map view, and detailed deployment info',
        initialWidth: 12,
        initialHeight: 40,
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
        hasStyle: true,
        permission: Stage.GenericConfig.WIDGET_PERMISSION('deploymentsView'),

        fetchData(_widget, toolbox, params: GridParams) {
            // TODO(RD-1224): add resolving `filterRules` if they are not fetched (after RD-377)
            return toolbox
                .getManager()
                .doGet('/deployments', params)
                .then((response: DeploymentsResponse) => {
                    const context = toolbox.getContext();
                    // TODO(RD-1224): detect if deploymentId is not present in the current page and reset it.
                    // Do that only if `fetchData` was called from `DataTable`. If it's just polling,
                    // then don't reset it (because user may be interacting with some other component)
                    if (context.getValue('deploymentId') === undefined && response.items.length > 0) {
                        context.setValue('deploymentId', response.items[0].id);
                    }

                    return response;
                });
        },

        render(widget, data, _error, toolbox) {
            const { DataTable, Loading } = Stage.Basic;
            const { fieldsToShow, pageSize } = widget.configuration;

            if (Stage.Utils.isEmptyWidgetData(data)) {
                return <Loading />;
            }

            return (
                <DataTable fetchData={toolbox.refresh} pageSize={pageSize} selectable sizeMultiplier={20}>
                    {deploymentsViewColumnIds.map(columnId => {
                        const columnDefinition = deploymentsViewColumnDefinitions[columnId];
                        return (
                            <DataTable.Column
                                key={columnId}
                                name={columnDefinition.sortFieldName}
                                label={columnDefinition.label}
                                width={columnDefinition.width}
                                tooltip={columnDefinition.tooltip}
                                show={fieldsToShow.includes(columnId)}
                            />
                        );
                    })}

                    {/* TODO(RD-1224): add type for deployment */}
                    {data.items.flatMap(renderDeploymentRow(toolbox, fieldsToShow))}
                </DataTable>
            );
        }
    });
}
