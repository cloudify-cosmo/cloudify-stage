// @ts-nocheck File not migrated fully to TS
import ActionsMenus from './ActionsMenus';
import DeploymentUpdatedIcon from './DeploymentUpdatedIcon';
import DeploymentsViewDefaultProps from './props/DeploymentsViewDefaultProps';
import DeploymentsViewPropTypes from './props/DeploymentsViewPropTypes';

const t = Stage.Utils.getT('widgets.deployments.table');

export default function DeploymentsTable({
    allowedSettingTo,
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
}) {
    const { useResettableState } = Stage.Hooks;
    const { IdPopup } = Stage.Shared;
    const { DataTable, ResourceVisibility } = Stage.Basic;
    const { LatestExecutionStatusIcon } = Stage.Common.Executions;
    const [hoveredDeployment, setHoveredDeployment, clearHoveredDeployment] = useResettableState(null);
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
            <DataTable.Column label={t('columns.name')} name="name" width="20%" />
            <DataTable.Column label={t('columns.lastExecution')} width="5%" />
            <DataTable.Column label={t('columns.blueprint')} name="blueprint_id" width="15%" show={!data.blueprintId} />
            <DataTable.Column label={t('columns.siteName')} name="site_name" width="15%" />
            <DataTable.Column label={t('columns.created')} name="created_at" width="15%" />
            <DataTable.Column label={t('columns.updated')} name="updated_at" width="15%" />
            <DataTable.Column label={t('columns.creator')} name="created_by" width="8%" />
            <DataTable.Column className="rowActions" width="7%" />

            {data.items.map(item => {
                return (
                    <DataTable.Row
                        id={`${tableName}_${item.id}`}
                        key={item.id}
                        selected={item.isSelected}
                        onClick={() => onSelectDeployment(item)}
                        onMouseOver={setHoveredDeployment}
                        onFocus={setHoveredDeployment}
                        onMouseOut={clearHoveredDeployment}
                        onBlur={clearHoveredDeployment}
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
                        <DataTable.Data className="rowActions">
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

DeploymentsTable.propTypes = DeploymentsViewPropTypes;

DeploymentsTable.defaultProps = DeploymentsViewDefaultProps;
