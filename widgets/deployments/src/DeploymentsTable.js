/**
 * Created by kinneretzin on 18/10/2016.
 */

import MenuAction from './MenuAction';
import DeploymentUpdatedIcon from './DeploymentUpdatedIcon';

export default class extends React.Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        fetchData: PropTypes.func,
        onSelectDeployment: PropTypes.func,
        onShowLogs: PropTypes.func,
        onShowUpdateDetails: PropTypes.func,
        onActOnExecution: PropTypes.func,
        onMenuAction: PropTypes.func,
        onError: PropTypes.func,
        onSetVisibility: PropTypes.func,
        allowedSettingTo: PropTypes.array,
        noDataMessage: PropTypes.string,
        showExecutionStatusLabel: PropTypes.bool
    };

    static defaultProps = {
        fetchData: () => {},
        onSelectDeployment: () => {},
        onActOnExecution: () => {},
        onMenuAction: () => {},
        onError: () => {},
        onSetVisibility: () => {},
        allowedSettingTo: ['tenant', 'global'],
        noDataMessage: ''
    };

    render() {
        const {
            allowedSettingTo,
            data,
            fetchData,
            noDataMessage,
            onActOnExecution,
            onMenuAction,
            onSelectDeployment,
            onSetVisibility,
            onShowLogs,
            onShowUpdateDetails,
            showExecutionStatusLabel,
            widget
        } = this.props;
        const { DataTable, ResourceVisibility } = Stage.Basic;
        const { LastExecutionStatusIcon } = Stage.Common;
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
                <DataTable.Column label="Name" name="id" width="20%" />
                <DataTable.Column label="Last Execution" width="5%" />
                <DataTable.Column label="Blueprint" name="blueprint_id" width="15%" show={!data.blueprintId} />
                <DataTable.Column label="Site Name" name="site_name" width="15%" />
                <DataTable.Column label="Created" name="created_at" width="15%" />
                <DataTable.Column label="Updated" name="updated_at" width="15%" />
                <DataTable.Column label="Creator" name="created_by" width="10%" />
                <DataTable.Column width="5%" />

                {data.items.map(item => {
                    return (
                        <DataTable.Row
                            id={`${tableName}_${item.id}`}
                            key={item.id}
                            selected={item.isSelected}
                            onClick={() => onSelectDeployment(item)}
                        >
                            <DataTable.Data>
                                <a className="deploymentName" href="#!">
                                    {item.id}
                                </a>
                                <ResourceVisibility
                                    visibility={item.visibility}
                                    onSetVisibility={visibility => onSetVisibility(item.id, visibility)}
                                    allowedSettingTo={allowedSettingTo}
                                    className="rightFloated"
                                />
                            </DataTable.Data>
                            <DataTable.Data>
                                <LastExecutionStatusIcon
                                    execution={item.lastExecution}
                                    onShowLogs={() => onShowLogs(item.id, item.lastExecution.id)}
                                    onShowUpdateDetails={onShowUpdateDetails}
                                    onActOnExecution={onActOnExecution}
                                    showLabel={showExecutionStatusLabel}
                                    labelAttached={false}
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
                            <DataTable.Data className="center aligned rowActions">
                                <MenuAction item={item} onSelectAction={onMenuAction} />
                            </DataTable.Data>
                        </DataTable.Row>
                    );
                })}
            </DataTable>
        );
    }
}
