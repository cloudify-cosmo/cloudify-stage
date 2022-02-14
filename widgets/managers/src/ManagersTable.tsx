// @ts-nocheck File not migrated fully to TS

import Actions from './actions';
import ConsoleIcon from './ConsoleIcon';
import ExecuteWorkflowButton from './ExecuteWorkflowButton';
import ExecuteWorkflowIcon from './ExecuteWorkflowIcon';
import RefreshButton from './RefreshButton';
import RefreshIcon from './RefreshIcon';
import StatusIcon from './StatusIcon';

function ManagersTable({ data, toolbox, widget }) {
    const { useBoolean, useRefreshEvent } = Stage.Hooks;
    const { useState, useEffect } = React;
    const [bulkOperation, setBulkOperation] = useState(false);
    const [deployment, setDeployment] = useState({ id: '' });
    const [error, setError] = useState(null);
    const [selectedManagerId, setSelectedManagerId] = useState(null);
    const [selectedManagers, setSelectedManagers] = useState([]);
    const [isExecuteWorkflowModalShown, showExecuteWorkflowModal, hideExecuteWorkflowModal] = useBoolean();
    const [workflow, setWorkflow] = useState({ name: '', parameters: {} });

    function createFetchingStatuses(managerIds) {
        const newStatuses = {};
        _.forEach(managerIds, managerId => {
            newStatuses[managerId] = { isFetching: true, status: {} };
        });
        return newStatuses;
    }

    const [statuses, setStatuses] = useState(createFetchingStatuses(_.map(data.items, 'id')));

    function handleStatusBulkFetching(managerIds) {
        setStatuses({ ...statuses, ...createFetchingStatuses(managerIds) });
    }

    function handleStatusUpdate(managerId, status) {
        statuses[managerId] = { isFetching: false, status };
        setStatuses({ ...statuses });
    }

    function handleStatusError(managerId) {
        handleStatusUpdate(managerId, {});
        setError(`Status update for ${managerId} has failed.`);
    }

    useRefreshEvent(toolbox, 'managers:refresh');

    useEffect(() => {
        const actions = new Actions(toolbox);
        _.forEach(statuses, (managerStatus, managerId) =>
            actions.getClusterStatus(managerId, _.noop, handleStatusUpdate, handleStatusError)
        );
    }, []);

    function selectManager(manager) {
        const clickedManagerId = manager.id;
        const clickedAlreadySelectedManager = clickedManagerId === selectedManagerId;
        setSelectedManagerId(clickedAlreadySelectedManager ? null : manager.id);
    }

    function openExecuteWorkflowModal(id, bulk, workflowToExecute) {
        setDeployment({ id });
        setWorkflow(workflowToExecute);
        showExecuteWorkflowModal();
        setBulkOperation(bulk);
    }

    function onExecuteWorkflowModalHide() {
        setDeployment({ id: '' });
        setWorkflow({ name: '', parameters: {} });
        hideExecuteWorkflowModal();
        toolbox.refresh();
    }

    function actOnExecution(execution, action, executionError) {
        setError(executionError);
    }

    function handleStatusFetching(managerId) {
        setStatuses({ ...statuses, [managerId]: { isFetching: true, status: {} } });
    }

    const NO_DATA_MESSAGE = 'There are no Managers available.';
    const { configuration } = widget;
    const { fieldsToShow } = configuration;
    const totalSize = data.total > 0 ? undefined : 0;

    const allManagers = _.map(data.items, manager => manager.id);
    const allManagersSelected = _.isEmpty(_.difference(allManagers, selectedManagers));
    const workflows = !_.isEmpty(selectedManagers) ? _.get(data, 'items[0].workflows', []) : [];

    const { Checkbox, DataTable, ErrorMessage } = Stage.Basic;
    const { ExecuteWorkflowModal, LastExecutionStatusIcon } = Stage.Common;

    return (
        <div>
            <ErrorMessage error={error} onDismiss={() => setError(null)} autoHide />

            <DataTable selectable={false} noDataMessage={NO_DATA_MESSAGE} totalSize={totalSize}>
                <DataTable.Column
                    width="20px"
                    label={
                        <Checkbox
                            checked={allManagersSelected}
                            indeterminate={!allManagersSelected && !_.isEmpty(selectedManagers)}
                            onChange={() => setSelectedManagers(allManagersSelected ? [] : allManagers)}
                            onClick={e => e.stopPropagation()}
                        />
                    }
                />
                <DataTable.Column label="Deployment" show={fieldsToShow.indexOf('Deployment') >= 0} />
                <DataTable.Column label="IP" show={fieldsToShow.indexOf('IP') >= 0} />
                <DataTable.Column label="Last Execution" show={fieldsToShow.indexOf('Last Execution') >= 0} />
                <DataTable.Column
                    label="Status"
                    width="50px"
                    centerAligned
                    show={fieldsToShow.indexOf('Status') >= 0}
                />
                <DataTable.Column
                    label="Actions"
                    width="150px"
                    centerAligned
                    show={fieldsToShow.indexOf('Actions') >= 0}
                />

                {_.map(data.items, manager => {
                    const inSelectedManagers = _.includes(selectedManagers, manager.id);
                    const managerStatus = _.get(statuses, manager.id, {
                        isFetching: false,
                        status: {}
                    });

                    return (
                        <DataTable.Row
                            key={manager.id}
                            selected={manager.id === selectedManagerId}
                            onClick={() => selectManager(manager)}
                        >
                            <DataTable.Data>
                                <Checkbox
                                    checked={inSelectedManagers}
                                    onChange={() =>
                                        setSelectedManagers(
                                            inSelectedManagers
                                                ? _.filter(selectedManagers, id => id !== manager.id)
                                                : [...selectedManagers, manager.id]
                                        )
                                    }
                                    onClick={e => e.stopPropagation()}
                                />
                            </DataTable.Data>
                            <DataTable.Data>{manager.id}</DataTable.Data>
                            <DataTable.Data>{manager.ip}</DataTable.Data>
                            <DataTable.Data>
                                <LastExecutionStatusIcon
                                    execution={manager.lastExecution}
                                    onActOnExecution={actOnExecution}
                                    showLabel
                                    labelAttached={false}
                                    toolbox={toolbox}
                                />
                            </DataTable.Data>
                            <DataTable.Data className="center aligned">
                                <StatusIcon status={managerStatus.status} isFetching={managerStatus.isFetching} />
                            </DataTable.Data>
                            <DataTable.Data className="center aligned">
                                <ConsoleIcon manager={manager} />
                                <RefreshIcon
                                    manager={manager}
                                    toolbox={toolbox}
                                    onStart={handleStatusFetching}
                                    onSuccess={handleStatusUpdate}
                                    onFail={handleStatusError}
                                />
                                <ExecuteWorkflowIcon
                                    workflows={manager.workflows}
                                    onClick={selectedWorkflow =>
                                        openExecuteWorkflowModal(manager.id, false, selectedWorkflow)
                                    }
                                />
                            </DataTable.Data>
                        </DataTable.Row>
                    );
                })}

                <DataTable.Action>
                    <RefreshButton
                        managers={selectedManagers}
                        toolbox={toolbox}
                        onStart={handleStatusBulkFetching}
                        onSuccess={handleStatusUpdate}
                        onFail={handleStatusError}
                    />
                    <ExecuteWorkflowButton
                        noManagers={_.isEmpty(selectedManagers)}
                        workflows={workflows}
                        onClick={selectedWorkflow =>
                            openExecuteWorkflowModal(selectedManagers[0], true, selectedWorkflow)
                        }
                    />
                </DataTable.Action>
            </DataTable>

            {deployment.id && (
                <ExecuteWorkflowModal
                    toolbox={toolbox}
                    open={isExecuteWorkflowModalShown}
                    deploymentId={deployment.id}
                    deployments={bulkOperation ? selectedManagers : []}
                    workflow={workflow}
                    onHide={onExecuteWorkflowModalHide}
                />
            )}
        </div>
    );
}

ManagersTable.propTypes = {
    data: PropTypes.shape({
        items: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                ip: PropTypes.string,
                workflows: PropTypes.shape({}),
                lastExecution: PropTypes.shape({})
            })
        ),
        total: PropTypes.number
    }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    widget: Stage.PropTypes.Widget.isRequired
};

export default React.memo(ManagersTable, _.isEqual);
