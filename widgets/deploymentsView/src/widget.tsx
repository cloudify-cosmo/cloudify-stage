import { mapValues, startCase } from 'lodash';
import { ReactNode } from 'react';

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
    /**
     * The name of the backend field to sort by
     */
    sortFieldName?: string;
    width?: string;
    render(deployment: any): ReactNode;
}

type WithOptionalProperties<T, OptionalProperties extends keyof T> = Omit<T, OptionalProperties> &
    Partial<Pick<T, OptionalProperties>>;

const namelessDeploymentsViewColumnDefinitions: Record<
    DeploymentsViewColumnId,
    WithOptionalProperties<ColumnDefinition, 'name'>
> = {
    status: {
        // TODO: add tooltip
        width: '5%',
        render() {
            return 'Status (TODO)';
        }
    },
    name: {
        sortFieldName: 'id',
        render(deployment) {
            return deployment.id;
        }
    },
    blueprintName: {
        sortFieldName: 'blueprint_id',
        render(deployment) {
            return deployment.blueprint_id;
        }
    },
    environmentType: {
        render() {
            return 'Environment Type (TODO)';
        }
    },
    location: {
        sortFieldName: 'site_name',
        render(deployment) {
            return deployment.site_name;
        }
    },
    subenvironmentsCount: {
        // TODO: add icon
        // TODO: add tooltips for DataTable
        name: 'Subenvironments',
        width: '5%',
        render() {
            return '0 (TODO)';
        }
    },
    subservicesCount: {
        // TODO: add icon
        name: 'Subservices',
        width: '5%',
        render() {
            return '0 (TODO)';
        }
    }
};

const deploymentsViewColumnDefinitions: Record<DeploymentsViewColumnId, ColumnDefinition> = mapValues(
    namelessDeploymentsViewColumnDefinitions,
    (columnDefinition, columnId) => ({
        name: startCase(columnId),
        ...columnDefinition
    })
);

function getDeploymentProgressUnderline(deployment: any): ReactNode {
    if (deployment.id === 'hello') {
        // TODO(RD-1224): adjust states to match the ones returned from API
        const deploymentStates = ['in-progress', 'pending', 'failure'];
        // NOTE: random state for now
        const state = deploymentStates[Math.floor(Math.random() * deploymentStates.length)];

        return (
            <div
                style={{ width: `${50 + Math.random() * 50}%` }}
                className={Stage.Utils.combineClassNames(['deployment-progress-bar', state])}
            />
        );
    }

    return null;
}

interface GridParams {
    _offset: number;
    _size: number;
    _sort: string;
}

// TODO: add a generic type for widget configuration
interface DeploymentsResponse {
    items: any[];
    metadata: any;
}

// TODO(RD-1224): remove environment check
if (process.env.NODE_ENV === 'development') {
    Stage.defineWidget<GridParams, DeploymentsResponse>({
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
        // TODO: use a new permissions config
        permission: Stage.GenericConfig.WIDGET_PERMISSION('deployments'),

        fetchData(_widget, toolbox, params: GridParams) {
            // TODO: add resolving `filterRules` if they are not fetched (after RD-377)
            // TODO: set deploymentId if not set
            return toolbox
                .getManager()
                .doGet('/deployments', params)
                .then((response: DeploymentsResponse) => {
                    const context = toolbox.getContext();
                    // TODO: detect if deploymentId is not present in the current page and reset it.
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

            const selectedDeploymentId = toolbox.getContext().getValue('deploymentId');

            return (
                <DataTable fetchData={toolbox.refresh} pageSize={pageSize} selectable sizeMultiplier={20}>
                    {deploymentsViewColumnIds.map(columnId => {
                        const columnDefinition = deploymentsViewColumnDefinitions[columnId];
                        return (
                            <DataTable.Column
                                key={columnId}
                                name={columnDefinition.sortFieldName}
                                label={columnDefinition.name}
                                width={columnDefinition.width}
                                show={fieldsToShow.indexOf(columnId) !== -1}
                            />
                        );
                    })}

                    {/* TODO: add type for deployment */}
                    {data.items.flatMap((deployment: any) => {
                        const progressUnderline = getDeploymentProgressUnderline(deployment);
                        return [
                            <DataTable.Row
                                key={deployment.id}
                                className={progressUnderline ? undefined : 'deployment-progressless-row'}
                                selected={deployment.id === selectedDeploymentId}
                                onClick={() => toolbox.getContext().setValue('deploymentId', deployment.id)}
                            >
                                {Object.values(deploymentsViewColumnDefinitions).map(columnDefinition => (
                                    <DataTable.Data>{columnDefinition.render(deployment)}</DataTable.Data>
                                ))}
                            </DataTable.Row>,
                            progressUnderline && (
                                <DataTable.Row key={`${deployment.id}-progress`} className="deployment-progress-row">
                                    <DataTable.Data
                                        className="deployment-progress-row-cell"
                                        // TODO: change to colSpan
                                        colSpan={fieldsToShow.length}
                                    >
                                        {progressUnderline}
                                    </DataTable.Data>
                                </DataTable.Row>
                            )
                        ].filter(Boolean);
                    })}
                </DataTable>
            );
        }
    });
}
