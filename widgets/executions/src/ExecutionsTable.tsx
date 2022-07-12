// @ts-nocheck File not migrated fully to TS

import DryRunIcon from './DryRunIcon';
import SystemWorkflowIcon from './SystemWorkflowIcon';
import ExecutionWorkflowGraph from './tasksGraph/ExecutionWorkflowGraph';

const MAX_TABLE_GRAPH_HEIGHT = 380;

export default class ExecutionsTable extends React.Component {
    static MenuAction = {
        SHOW_EXECUTION_PARAMETERS: 'execution_parameters',
        SHOW_UPDATE_DETAILS: 'update_details',
        SHOW_ERROR_DETAILS: 'error_details',
        RESUME_EXECUTION: Stage.Utils.Execution.FORCE_RESUME_ACTION,
        CANCEL_EXECUTION: Stage.Utils.Execution.CANCEL_ACTION,
        FORCE_CANCEL_EXECUTION: Stage.Utils.Execution.FORCE_CANCEL_ACTION,
        KILL_CANCEL_EXECUTION: Stage.Utils.Execution.KILL_CANCEL_ACTION
    };

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

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('executions:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget.configuration, nextProps.widget.configuration) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('executions:refresh', this.refreshData);
    }

    setHoveredExecution(idToCheck) {
        const { hoveredExecution } = this.state;
        if (hoveredExecution !== idToCheck) {
            this.setState({ hoveredExecution: idToCheck });
        }
    }

    actionClick = (execution, proxy, { name }) => {
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

            default:
        }
    };

    fetchGridData = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
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

    unsetHoveredExecution(idToCheck) {
        const { hoveredExecution } = this.state;
        if (hoveredExecution === idToCheck) {
            this.setState({ hoveredExecution: null });
        }
    }

    actOnExecution(execution, action) {
        const { toolbox } = this.props;
        const actions = new Stage.Common.Executions.Actions(toolbox);
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
        const ParameterValue = Stage.Common.Components.Parameter.Value;
        const ParameterValueDescription = Stage.Common.Components.Parameter.ValueDescription;
        const { UpdateDetailsModal } = Stage.Common.Deployments;
        const { Utils } = Stage;

        const { MenuAction } = ExecutionsTable;

        const { fieldsToShow } = widget.configuration;
        const execution = stateExecution || { parameters: {} };
        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable
                    fetchData={this.fetchGridData}
                    totalSize={data.total}
                    pageSize={widget.configuration.pageSize}
                    sortColumn={widget.configuration.sortColumn}
                    sortAscending={widget.configuration.sortAscending}
                    selectable
                    className="executionsTable"
                    noDataMessage={NO_DATA_MESSAGE}
                >
                    <DataTable.Column label="" width="43px" />
                    <DataTable.Column
                        label="Blueprint"
                        name="blueprint_id"
                        width="150%"
                        show={fieldsToShow.indexOf('Blueprint') >= 0 && !data.blueprintId && !data.deploymentId}
                    />
                    <DataTable.Column
                        label="Deployment"
                        name="deployment_display_name"
                        width="150%"
                        show={fieldsToShow.indexOf('Deployment') >= 0 && !data.deployment_display_name}
                    />
                    <DataTable.Column
                        label="Deployment ID"
                        name="deployment_id"
                        width="150%"
                        show={fieldsToShow.indexOf('Deployment ID') >= 0 && !data.deploymentId}
                    />
                    <DataTable.Column
                        label="Workflow"
                        name="workflow_id"
                        width="200%"
                        show={fieldsToShow.indexOf('Workflow') >= 0}
                    />
                    <DataTable.Column label="Id" name="id" width="10%" show={fieldsToShow.indexOf('Id') >= 0} />
                    <DataTable.Column
                        label="Created"
                        name="created_at"
                        width="110%"
                        show={fieldsToShow.indexOf('Created') >= 0}
                    />
                    <DataTable.Column
                        label="Scheduled"
                        name="scheduled_for"
                        width="100%"
                        show={fieldsToShow.indexOf('Scheduled') >= 0}
                    />
                    <DataTable.Column
                        label="Ended"
                        name="ended_at"
                        width="100%"
                        show={fieldsToShow.indexOf('Ended') >= 0}
                    />
                    <DataTable.Column
                        label="Creator"
                        name="created_by"
                        width="100%"
                        show={fieldsToShow.indexOf('Creator') >= 0}
                    />
                    <DataTable.Column
                        label="Attributes"
                        width="100%"
                        show={fieldsToShow.indexOf('System') >= 0 || fieldsToShow.indexOf('Attributes') >= 0}
                    />
                    <DataTable.Column label="Status" width="150%" show={fieldsToShow.indexOf('Status') >= 0} />
                    <DataTable.Column
                        width="40px"
                        show={fieldsToShow.indexOf('Params') >= 0 || fieldsToShow.indexOf('Actions') >= 0}
                    />

                    {data.items.map(item => {
                        return (
                            <DataTable.RowExpandable key={item.id} expanded={item.isSelected}>
                                <DataTable.Row
                                    key={item.id}
                                    selected={item.isSelected}
                                    onClick={() => this.selectExecution(item)}
                                    onMouseOver={() => this.setHoveredExecution(item.id)}
                                    onFocus={() => this.setHoveredExecution(item.id)}
                                    onMouseOut={() => this.unsetHoveredExecution(item.id)}
                                    onBlur={() => this.unsetHoveredExecution(item.id)}
                                >
                                    <DataTable.Data>
                                        <IdPopup id={item.id} selected={hoveredExecution === item.id} />
                                    </DataTable.Data>
                                    <DataTable.Data style={{ wordBreak: 'break-word' }}>
                                        {item.blueprint_id}
                                    </DataTable.Data>
                                    <DataTable.Data style={{ wordBreak: 'break-word' }}>
                                        {item.deployment_display_name}
                                    </DataTable.Data>
                                    <DataTable.Data style={{ wordBreak: 'break-word' }}>
                                        {item.deployment_id}
                                    </DataTable.Data>
                                    <DataTable.Data style={{ wordBreak: 'break-word' }}>
                                        {item.workflow_id}
                                    </DataTable.Data>
                                    <DataTable.Data>{item.id}</DataTable.Data>
                                    <DataTable.Data>{item.created_at}</DataTable.Data>
                                    <DataTable.Data>{item.scheduled_for}</DataTable.Data>
                                    <DataTable.Data>{item.ended_at}</DataTable.Data>
                                    <DataTable.Data style={{ wordBreak: 'break-word' }}>
                                        {item.created_by}
                                    </DataTable.Data>
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
                                                    onClick={_.wrap(item, this.actionClick)}
                                                />
                                                {Utils.Execution.isUpdateExecution(item) && (
                                                    <Menu.Item
                                                        content="Show Update Details"
                                                        icon="magnify"
                                                        name={MenuAction.SHOW_UPDATE_DETAILS}
                                                        onClick={_.wrap(item, this.actionClick)}
                                                    />
                                                )}
                                                {Utils.Execution.isFailedExecution(item) && (
                                                    <Menu.Item
                                                        content="Show Error Details"
                                                        icon={<Icon name="exclamation circle" color="red" />}
                                                        name={MenuAction.SHOW_ERROR_DETAILS}
                                                        onClick={_.wrap(item, this.actionClick)}
                                                    />
                                                )}
                                                {(Utils.Execution.isCancelledExecution(item) ||
                                                    Utils.Execution.isFailedExecution(item)) && (
                                                    <Menu.Item
                                                        content="Resume"
                                                        icon={<Icon name="play" color="green" />}
                                                        name={MenuAction.RESUME_EXECUTION}
                                                        onClick={_.wrap(item, this.actionClick)}
                                                    />
                                                )}
                                                {(Utils.Execution.isActiveExecution(item) ||
                                                    Utils.Execution.isWaitingExecution(item)) && (
                                                    <Menu.Item
                                                        content="Cancel"
                                                        icon="cancel"
                                                        name={MenuAction.CANCEL_EXECUTION}
                                                        onClick={_.wrap(item, this.actionClick)}
                                                    />
                                                )}
                                                {(Utils.Execution.isActiveExecution(item) ||
                                                    Utils.Execution.isWaitingExecution(item)) && (
                                                    <Menu.Item
                                                        content="Force Cancel"
                                                        icon={<Icon name="cancel" color="red" />}
                                                        name={MenuAction.FORCE_CANCEL_EXECUTION}
                                                        onClick={_.wrap(item, this.actionClick)}
                                                    />
                                                )}
                                                <Menu.Item
                                                    content="Kill Cancel"
                                                    icon={<Icon name="stop" color="red" />}
                                                    name={MenuAction.KILL_CANCEL_EXECUTION}
                                                    onClick={_.wrap(item, this.actionClick)}
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
        items: PropTypes.arrayOf(
            PropTypes.shape({
                blueprint_id: PropTypes.string,
                created_at: PropTypes.string,
                created_by: PropTypes.string,
                deployment_id: PropTypes.string,
                ended_at: PropTypes.string,
                id: PropTypes.string,
                isSelected: PropTypes.bool,
                scheduled_for: PropTypes.string,
                workflow_id: PropTypes.string
            })
        ),
        total: PropTypes.number
    }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    widget: Stage.PropTypes.Widget.isRequired
};
