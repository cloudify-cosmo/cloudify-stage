import { deploymentsViewColumnDefinitions, DeploymentsViewColumnId, deploymentsViewColumnIds } from './columns';
import renderDeploymentRow from './renderDeploymentRow';
import './styles.scss';
import type { Deployment } from './types';

interface GridParams {
    _offset: number;
    _size: number;
    _sort: string;
}

interface DeploymentsResponse {
    items: Deployment[];
    metadata: {
        pagination: {
            offset: number;
            size: number;
            total: number;
        };
    };
}

interface DeploymentsViewWidgetConfiguration {
    filterId?: string;
    filterByParentDeployment: boolean;
    fieldsToShow: DeploymentsViewColumnId[];
    pageSize: number;
    sortColumn: string;
    sortAscending: string;
}

const i18nPrefix = 'widgets.deploymentsView';

// TODO(RD-1226): remove environment check
if (process.env.NODE_ENV === 'development' || process.env.TEST) {
    Stage.defineWidget<GridParams, DeploymentsResponse, DeploymentsViewWidgetConfiguration>({
        id: 'deploymentsView',
        name: Stage.i18n.t(`${i18nPrefix}.name`),
        description: Stage.i18n.t(`${i18nPrefix}.description`),
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
                name: Stage.i18n.t(`${i18nPrefix}.configuration.filterId.name`)
            },
            {
                id: 'filterByParentDeployment',
                type: Stage.Basic.GenericField.BOOLEAN_TYPE,
                name: Stage.i18n.t(`${i18nPrefix}.configuration.filterByParentDeployment.name`),
                description: Stage.i18n.t(`${i18nPrefix}.configuration.filterByParentDeployment.description`),
                default: false
            },
            // TODO(RD-1225): add map configuration
            {
                id: 'fieldsToShow',
                name: Stage.i18n.t(`${i18nPrefix}.configuration.fieldsToShow.name`),
                placeHolder: Stage.i18n.t(`${i18nPrefix}.configuration.fieldsToShow.placeholder`),
                items: deploymentsViewColumnIds.map(columnId => ({
                    name: deploymentsViewColumnDefinitions[columnId].name,
                    value: columnId
                })),
                default: deploymentsViewColumnIds.filter(columnId => columnId !== 'environmentType'),
                type: Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE
            },
            Stage.GenericConfig.PAGE_SIZE_CONFIG(100),
            Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
            Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
        ],
        isReact: true,
        hasReadme: true,
        hasStyle: false,
        permission: Stage.GenericConfig.WIDGET_PERMISSION('deploymentsView'),

        fetchData(_widget, toolbox, params: GridParams) {
            // TODO(RD-1530): add resolving `filterRules` if they are not fetched (after RD-377)
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
                <DataTable
                    fetchData={toolbox.refresh}
                    pageSize={pageSize}
                    selectable
                    sizeMultiplier={20}
                    // TODO(RD-1787): adjust `noDataMessage` to show the image
                    noDataMessage={Stage.i18n.t(`${i18nPrefix}.noDataMessage`)}
                    totalSize={data.metadata.pagination.total}
                >
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

                    {data.items.flatMap(renderDeploymentRow(toolbox, fieldsToShow))}
                </DataTable>
            );
        }
    });
}
