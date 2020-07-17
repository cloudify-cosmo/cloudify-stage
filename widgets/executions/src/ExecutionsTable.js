/**
 * Created by kinneretzin on 20/10/2016.
 */

import DryRunIcon from './DryRunIcon';
import SystemWorkflowIcon from './SystemWorkflowIcon';
import ExecutionWorkflowGraph from './tasksGraph/ExecutionWorkflowGraph';

const MAX_TABLE_GRAPH_HEIGHT = 380;

export default class ExecutionsTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            execution: null,
            errorModalOpen: false,
            executionParametersModalOpen: false,
            deploymentUpdateModalOpen: false,
            hoveredExecution: null,
            deploymentUpdateId: '',
            error: null
        };
    }

    static MenuAction = {
        SHOW_EXECUTION_PARAMETERS: 'execution_parameters',
        SHOW_UPDATE_DETAILS: 'update_details',
        SHOW_ERROR_DETAILS: 'error_details',
        RESUME_EXECUTION: Stage.Utils.Execution.FORCE_RESUME_ACTION,
        CANCEL_EXECUTION: Stage.Utils.Execution.CANCEL_ACTION,
        FORCE_CANCEL_EXECUTION: Stage.Utils.Execution.FORCE_CANCEL_ACTION,
        KILL_CANCEL_EXECUTION: Stage.Utils.Execution.KILL_CANCEL_ACTION
    };

    shouldComponentUpdate(nextProps, nextState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget.configuration, nextProps.widget.configuration) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('executions:refresh', this.refreshData, this);
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('executions:refresh', this.refreshData);
    }

    selectExecution(item) {
        const { toolbox } = this.props;

        const context = toolbox.getContext();
        const oldSelectedExecutionId = context.getValue('executionId');
        context.setValue('executionId', item.id === oldSelectedExecutionId ? null : item.id);
        context.setValue('nodeInstanceId', null);
        const eventFilter = 'eventFilter';
        context.setValue(eventFilter, {
            ...context.getValue(eventFilter),
            operationText: null
        });

        toolbox.getEventBus().trigger('filter:refresh');
    }

    actOnExecution(execution, action) {
        const { toolbox } = this.props;
        const actions = new Stage.Common.ExecutionActions(toolbox);
        actions
            .doAct(execution, action)
            .then(() => {
                this.setState({ error: null });
                toolbox.getEventBus().trigger('deployments:refresh');
                toolbox.getEventBus().trigger('executions:refresh');
            })
            .catch(err => {
                this.setState({ error: err.message });
            });
    }

    actionClick(execution, proxy, { name }) {
        const { MenuAction } = ExecutionsTable;

        switch (name) {
            case MenuAction.SHOW_EXECUTION_PARAMETERS:
                this.setState({ execution, executionParametersModalOpen: true, idPopupOpen: false });
                break;

            case MenuAction.SHOW_UPDATE_DETAILS:
                this.setState({ deploymentUpdateId: execution.parameters.update_id, deploymentUpdateModalOpen: true });
                break;

            case MenuAction.SHOW_ERROR_DETAILS:
                this.setState({ execution, errorModalOpen: true, idPopupOpen: false });
                break;

            case MenuAction.RESUME_EXECUTION:
            case MenuAction.CANCEL_EXECUTION:
            case MenuAction.FORCE_CANCEL_EXECUTION:
            case MenuAction.KILL_CANCEL_EXECUTION:
                this.actOnExecution(execution, name);
                break;
        }
    }

    fetchGridData(fetchParams) {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    }

    render() {
        const {
            deploymentUpdateId,
            deploymentUpdateModalOpen,
            error,
            errorModalOpen,
            execution: stateExecution,
            executionParametersModalOpen,
            hoveredExecution
        } = this.state;
        const { data, toolbox, widget } = this.props;
        const NO_DATA_MESSAGE = "There are no Executions available. Probably there's no deployment created, yet.";
        const {
            CancelButton,
            CopyToClipboardButton,
            DataTable,
            ErrorMessage,
            HighlightText,
            Icon,
            Menu,
            Modal,
            PopupMenu,
            Table
        } = Stage.Basic;
        const { ExecutionStatus, IdPopup } = Stage.Shared;
        const { ParameterValue, ParameterValueDescription, UpdateDetailsModal } = Stage.Common;
        const { Utils } = Stage;

        const { MenuAction } = ExecutionsTable;

        const { fieldsToShow } = widget.configuration;
        const execution = stateExecution || { parameters: {} };
        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable
                    fetchData={this.fetchGridData.bind(this)}
                    totalSize={data.total}
                    pageSize={widget.configuration.pageSize}
                    sortColumn={widget.configuration.sortColumn}
                    sortAscending={widget.configuration.sortAscending}
                    selectable
                    className="executionsTable"
                    noDataMessage={NO_DATA_MESSAGE}
                >
                    <DataTable.Column label="" width="1%" />
                    <DataTable.Column
                        label="Blueprint"
                        name="blueprint_id"
                        width="15%"
                        show={fieldsToShow.indexOf('Blueprint') >= 0 && !data.blueprintId && !data.deploymentId}
                    />
                    <DataTable.Column
                        label="Deployment"
                        name="deployment_id"
                        width="15%"
                        show={fieldsToShow.indexOf('Deployment') >= 0 && !data.deploymentId}
                    />
                    <DataTable.Column
                        label="Workflow"
                        name="workflow_id"
                        width="15%"
                        show={fieldsToShow.indexOf('Workflow') >= 0}
                    />
                    <DataTable.Column label="Id" name="id" width="10%" show={fieldsToShow.indexOf('Id') >= 0} />
                    <DataTable.Column
                        label="Created"
                        name="created_at"
                        width="10%"
                        show={fieldsToShow.indexOf('Created') >= 0}
                    />
                    <DataTable.Column
                        label="Scheduled"
                        name="scheduled_for"
                        width="10%"
                        show={fieldsToShow.indexOf('Scheduled') >= 0}
                    />
                    <DataTable.Column
                        label="Ended"
                        name="ended_at"
                        width="10%"
                        show={fieldsToShow.indexOf('Ended') >= 0}
                    />
                    <DataTable.Column
                        label="Creator"
                        name="created_by"
                        width="5%"
                        show={fieldsToShow.indexOf('Creator') >= 0}
                    />
                    <DataTable.Column
                        label="Attributes"
                        width="5%"
                        show={fieldsToShow.indexOf('System') >= 0 || fieldsToShow.indexOf('Attributes') >= 0}
                    />
                    <DataTable.Column label="Status" width="15%" show={fieldsToShow.indexOf('Status') >= 0} />
                    <DataTable.Column
                        width="5%"
                        show={fieldsToShow.indexOf('Params') >= 0 || fieldsToShow.indexOf('Actions') >= 0}
                    />

                    {data.items.map(item => {
                        return (
                            <DataTable.RowExpandable key={item.id} expanded={item.isSelected}>
                                <DataTable.Row
                                    key={item.id}
                                    selected={item.isSelected}
                                    onClick={this.selectExecution.bind(this, item)}
                                    onMouseOver={() =>
                                        hoveredExecution !== item.id && this.setState({ hoveredExecution: item.id })
                                    }
                                    onMouseOut={() =>
                                        hoveredExecution === item.id && this.setState({ hoveredExecution: null })
                                    }
                                >
                                    <DataTable.Data>
                                        <IdPopup id={item.id} selected={hoveredExecution === item.id} />
                                    </DataTable.Data>
                                    <DataTable.Data>{item.blueprint_id}</DataTable.Data>
                                    <DataTable.Data>{item.deployment_id}</DataTable.Data>
                                    <DataTable.Data>{item.workflow_id}</DataTable.Data>
                                    <DataTable.Data>{item.id}</DataTable.Data>
                                    <DataTable.Data>{item.created_at}</DataTable.Data>
                                    <DataTable.Data>{item.scheduled_for}</DataTable.Data>
                                    <DataTable.Data>{item.ended_at}</DataTable.Data>
                                    <DataTable.Data>{item.created_by}</DataTable.Data>
                                    <DataTable.Data className="center aligned">
                                        <SystemWorkflowIcon execution={item} />
                                        <DryRunIcon execution={item} />
                                    </DataTable.Data>
                                    <DataTable.Data className="center aligned">
                                        <ExecutionStatus execution={item} />
                                    </DataTable.Data>
                                    <DataTable.Data className="center aligned">
                                        <PopupMenu className="menuAction">
                                            <Menu pointing vertical>
                                                <Menu.Item
                                                    content="Show Execution Parameters"
                                                    icon="options"
                                                    name={MenuAction.SHOW_EXECUTION_PARAMETERS}
                                                    onClick={this.actionClick.bind(this, item)}
                                                />
                                                {Utils.Execution.isUpdateExecution(item) && (
                                                    <Menu.Item
                                                        content="Show Update Details"
                                                        icon="magnify"
                                                        name={MenuAction.SHOW_UPDATE_DETAILS}
                                                        onClick={this.actionClick.bind(this, item)}
                                                    />
                                                )}
                                                {Utils.Execution.isFailedExecution(item) && (
                                                    <Menu.Item
                                                        content="Show Error Details"
                                                        icon={<Icon name="exclamation circle" color="red" />}
                                                        name={MenuAction.SHOW_ERROR_DETAILS}
                                                        onClick={this.actionClick.bind(this, item)}
                                                    />
                                                )}
                                                {(Utils.Execution.isCancelledExecution(item) ||
                                                    Utils.Execution.isFailedExecution(item)) && (
                                                    <Menu.Item
                                                        content="Resume"
                                                        icon={<Icon name="play" color="green" />}
                                                        name={MenuAction.RESUME_EXECUTION}
                                                        onClick={this.actionClick.bind(this, item)}
                                                    />
                                                )}
                                                {(Utils.Execution.isActiveExecution(item) ||
                                                    Utils.Execution.isWaitingExecution(item)) && (
                                                    <Menu.Item
                                                        content="Cancel"
                                                        icon="cancel"
                                                        name={MenuAction.CANCEL_EXECUTION}
                                                        onClick={this.actionClick.bind(this, item)}
                                                    />
                                                )}
                                                {(Utils.Execution.isActiveExecution(item) ||
                                                    Utils.Execution.isWaitingExecution(item)) && (
                                                    <Menu.Item
                                                        content="Force Cancel"
                                                        icon={<Icon name="cancel" color="red" />}
                                                        name={MenuAction.FORCE_CANCEL_EXECUTION}
                                                        onClick={this.actionClick.bind(this, item)}
                                                    />
                                                )}
                                                <Menu.Item
                                                    content="Kill Cancel"
                                                    icon={<Icon name="stop" color="red" />}
                                                    name={MenuAction.KILL_CANCEL_EXECUTION}
                                                    onClick={this.actionClick.bind(this, item)}
                                                />
                                            </Menu>
                                        </PopupMenu>
                                    </DataTable.Data>
                                </DataTable.Row>
                                <DataTable.DataExpandable key={item.id}>
                                    <ExecutionWorkflowGraph
                                        selectedExecution={item}
                                        toolbox={toolbox}
                                        containerHeight={MAX_TABLE_GRAPH_HEIGHT}
                                    />
                                </DataTable.DataExpandable>
                            </DataTable.RowExpandable>
                        );
                    })}
                </DataTable>

                <Modal
                    open={executionParametersModalOpen}
                    onClose={() => this.setState({ execution: null, executionParametersModalOpen: false })}
                >
                    <Modal.Header>Execution parameters</Modal.Header>
                    <Modal.Content scrolling>
                        {!_.isEmpty(execution.parameters) ? (
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Parameter</Table.HeaderCell>
                                        <Table.HeaderCell>
                                            Value <ParameterValueDescription />
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {_.map(_.keys(execution.parameters), parameterName => (
                                        <Table.Row key={parameterName}>
                                            <Table.Cell>{parameterName}</Table.Cell>
                                            <Table.Cell>
                                                <ParameterValue value={execution.parameters[parameterName]} />
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        ) : (
                            <span>No execution parameters.</span>
                        )}
                    </Modal.Content>
                    <Modal.Actions>
                        <CopyToClipboardButton
                            content="Copy Parameters"
                            text={JSON.stringify(execution.parameters, null, 2)}
                        />
                        <CancelButton
                            onClick={e => {
                                e.stopPropagation();
                                this.setState({ executionParametersModalOpen: false });
                            }}
                            content="Close"
                        />
                    </Modal.Actions>
                </Modal>

                <UpdateDetailsModal
                    open={deploymentUpdateModalOpen}
                    deploymentUpdateId={deploymentUpdateId}
                    onClose={() =>
                        this.setState({ execution: null, deploymentUpdateId: '', deploymentUpdateModalOpen: false })
                    }
                    toolbox={toolbox}
                />

                <Modal open={errorModalOpen} onClose={() => this.setState({ execution: null, errorModalOpen: false })}>
                    <Modal.Header>Error details</Modal.Header>
                    <Modal.Content scrolling>
                        <HighlightText language="python">{execution.error}</HighlightText>
                    </Modal.Content>
                    <Modal.Actions>
                        <CopyToClipboardButton content="Copy Error" text={execution.error} />
                        <CancelButton
                            onClick={e => {
                                e.stopPropagation();
                                this.setState({ errorModalOpen: false });
                            }}
                            content="Close"
                        />
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}

ExecutionsTable.propTypes = {
    data: PropTypes.shape({
        blueprintId: PropTypes.bool,
        deploymentId: PropTypes.bool,
        items: PropTypes.arrayOf(PropTypes.shape({})),
        total: PropTypes.number
    }).isRequired,
    toolbox: Stage.Common.PropTypes.Toolbox.isRequired,
    widget: Stage.Common.PropTypes.Widget.isRequired
};
