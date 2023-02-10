import ActionsMenus from './ActionsMenus';
import DeploymentUpdatedIcon from './DeploymentUpdatedIcon';
import type { DeploymentViewProps, EnhancedDeployment } from './types';

const translate = Stage.Utils.getT('widgets.deployments.table');

export default function DeploymentsTable({
    allowedSettingTo = ['tenant', 'global'],
    data,
    fetchData,
    noDataMessage,
    onActOnExecution,
    onDeploymentAction,
    onSelectDeployment,
    onWorkflowAction,
    onSetVisibility,
    showExecutionStatusLabel,
    toolbox,
    widget
}: DeploymentViewProps) {
    const { useResettableState } = Stage.Hooks;
    const { IdPopup } = Stage.Shared;
    const { DataTable, ResourceVisibility } = Stage.Basic;
    const { LatestExecutionStatusIcon } = Stage.Common.Executions;
    const [hoveredDeployment, setHoveredDeployment, clearHoveredDeployment] = useResettableState<string | null>(null);
    const tableName = 'deploymentsTable';

    return (
        <DataTable
            fetchData={fetchData}
            totalSize={data.total}
            pageSize={widget.configuration.pageSize}
            sortColumn={widget.configuration.sortColumn}
            sortAscending={widget.configuration.sortAscending}
            selectable
            searchable
            className={tableName}
            noDataMessage={noDataMessage}
        >
            <DataTable.Column name="id" />
            <DataTable.Column label={translate('columns.name')} name="name" width="20%" />
            <DataTable.Column label={translate('columns.lastExecution')} width="5%" />
            <DataTable.Column
                label={translate('columns.blueprint')}
                name="blueprint_id"
                width="15%"
                show={!data.blueprintId}
            />
            <DataTable.Column label={translate('columns.siteName')} name="site_name" width="15%" />
            <DataTable.Column label={translate('columns.created')} name="created_at" width="15%" />
            <DataTable.Column label={translate('columns.updated')} name="updated_at" width="15%" />
            <DataTable.Column label={translate('columns.creator')} name="created_by" width="10%" />
            <DataTable.Column width="5%" />

            {data.items.map((item: EnhancedDeployment & { isSelected: boolean }) => {
                return (
                    <DataTable.Row
                        id={`${tableName}_${item.id}`}
                        key={item.id}
                        selected={item.isSelected}
                        onClick={() => onSelectDeployment(item)}
                        onMouseOver={() => setHoveredDeployment(item.id)}
                        onMouseOut={clearHoveredDeployment}
                    >
                        <DataTable.Data>
                            <IdPopup selected={item.id === hoveredDeployment} id={item.id} />
                        </DataTable.Data>
                        <DataTable.Data>
                            <a className="deploymentName" href="#!">
                                {item.display_name}
                            </a>
                            <ResourceVisibility
                                visibility={item.visibility}
                                onSetVisibility={visibility => onSetVisibility(item.id, visibility)}
                                allowedSettingTo={allowedSettingTo}
                                className="rightFloated"
                            />
                        </DataTable.Data>
                        <DataTable.Data>
                            <LatestExecutionStatusIcon
                                execution={item.lastExecution}
                                onActOnExecution={onActOnExecution}
                                showLabel={showExecutionStatusLabel}
                                labelAttached={false}
                                toolbox={toolbox}
                            />
                        </DataTable.Data>
                        <DataTable.Data>{item.blueprint_id}</DataTable.Data>
                        <DataTable.Data>{item.site_name}</DataTable.Data>
                        <DataTable.Data>
                            {item.created_at}
                            <DeploymentUpdatedIcon deployment={item} />
                        </DataTable.Data>
                        <DataTable.Data>{item.updated_at}</DataTable.Data>
                        <DataTable.Data>{item.created_by}</DataTable.Data>
                        <DataTable.Data style={{ display: 'inline-flex' }}>
                            <ActionsMenus
                                deployment={item}
                                onDeploymentAction={onDeploymentAction}
                                onWorkflowAction={onWorkflowAction}
                                workflows={item.workflows}
                                toolbox={toolbox}
                            />
                        </DataTable.Data>
                    </DataTable.Row>
                );
            })}
        </DataTable>
    );
}
