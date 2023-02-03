import type { Toolbox, Widget } from 'app/utils/StageAPI';
import type { Execution } from 'app/utils/shared/ExecutionUtils';
import type { DataTableProps } from 'cloudify-ui-components';
import type { MenuItemProps } from 'semantic-ui-react';
import { Component } from 'react';
import { camelCase } from 'lodash';
import { translate } from './widget.utils';
import type { ExecutionsWidgetConfiguration } from './widget';
import DryRunIcon from './DryRunIcon';
import SystemWorkflowIcon from './SystemWorkflowIcon';
import ExecutionWorkflowGraph from './tasksGraph/ExecutionWorkflowGraph';

const MAX_TABLE_GRAPH_HEIGHT = 380;

interface ExecutionsTableProps {
    data: {
        blueprintId: boolean;
        deploymentId: boolean;
        items: (Execution & { isSelected: boolean })[];
        total: number;
    };
    toolbox: Toolbox;
    widget: Widget<ExecutionsWidgetConfiguration>;
}

interface ExecutionsTableState {
    execution?: Execution;
    errorModalOpen: boolean;
    executionParametersModalOpen: boolean;
    deploymentUpdateModalOpen: boolean;
    hoveredExecution?: string;
    deploymentUpdateId: '';
    error: null;
}

const translateActionMenu = Stage.Utils.composeT(translate, 'actionMenu');
const translateColumn = Stage.Utils.composeT(translate, 'columns');
const translateParametersModal = Stage.Utils.composeT(translate, 'parametersModal');
const translateParametersModalActions = Stage.Utils.composeT(translateParametersModal, 'actions');
const translateParametersModalColumns = Stage.Utils.composeT(translateParametersModal, 'columns');
const translateErrorModal = Stage.Utils.composeT(translate, 'errorModal');
const translateErrorModalActions = Stage.Utils.composeT(translateErrorModal, 'actions');

export default class ExecutionsTable extends Component<ExecutionsTableProps, ExecutionsTableState> {
    static MenuAction = {
        SHOW_EXECUTION_PARAMETERS: 'execution_parameters',
        SHOW_UPDATE_DETAILS: 'update_details',
        SHOW_ERROR_DETAILS: 'error_details',
        RESUME_EXECUTION: Stage.Utils.Execution.FORCE_RESUME_ACTION,
        CANCEL_EXECUTION: Stage.Utils.Execution.CANCEL_ACTION,
        FORCE_CANCEL_EXECUTION: Stage.Utils.Execution.FORCE_CANCEL_ACTION,
        KILL_CANCEL_EXECUTION: Stage.Utils.Execution.KILL_CANCEL_ACTION
    };

    constructor(props: ExecutionsTableProps) {
        super(props);

        this.state = {
            errorModalOpen: false,
            executionParametersModalOpen: false,
            deploymentUpdateModalOpen: false,
            deploymentUpdateId: '',
            error: null
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('executions:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: ExecutionsTableProps, nextState: ExecutionsTableState) {
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

    setHoveredExecution(idToCheck?: string) {
        const { hoveredExecution } = this.state;
        if (hoveredExecution !== idToCheck) {
            this.setState({ hoveredExecution: idToCheck });
        }
    }

    getActionMenuItemClickHandler(execution: Execution) {
        return (): MenuItemProps['onClick'] =>
            (_proxy, { name }) => {
                const { MenuAction } = ExecutionsTable;

                switch (name) {
                    case MenuAction.SHOW_EXECUTION_PARAMETERS:
                        this.setState({ execution, executionParametersModalOpen: true });
                        break;

                    case MenuAction.SHOW_UPDATE_DETAILS:
                        this.setState({
                            deploymentUpdateId: execution.parameters?.update_id,
                            deploymentUpdateModalOpen: true
                        });
                        break;

                    case MenuAction.SHOW_ERROR_DETAILS:
                        this.setState({ execution, errorModalOpen: true });
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
    }

    fetchGridData: DataTableProps['fetchData'] = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    selectExecution(item: Execution) {
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

    unsetHoveredExecution(idToCheck: string) {
        const { hoveredExecution } = this.state;
        if (hoveredExecution === idToCheck) {
            this.setState({ hoveredExecution: undefined });
        }
    }

    actOnExecution(
        execution: Execution,
        action:
            | typeof ExecutionsTable.MenuAction.RESUME_EXECUTION
            | typeof ExecutionsTable.MenuAction.CANCEL_EXECUTION
            | typeof ExecutionsTable.MenuAction.FORCE_CANCEL_EXECUTION
            | typeof ExecutionsTable.MenuAction.KILL_CANCEL_EXECUTION
    ) {
        const { toolbox } = this.props;
        const actions = new Stage.Common.Executions.Actions(toolbox.getManager());
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
        const execution: Pick<Execution, 'parameters' | 'error'> = stateExecution || { parameters: {} };

        function getLabelledColumn(
            name: keyof Execution | 'attributes',
            width = '100%',
            showCondition = true,
            defineName = false
        ) {
            const label = translateColumn(camelCase(name));
            return (
                <DataTable.Column
                    label={label}
                    name={defineName ? name : undefined}
                    width={width}
                    show={fieldsToShow.indexOf(label) >= 0 && showCondition}
                />
            );
        }

        function getLabelledNamedColumn(name: keyof Execution | 'attributes', width = '100%', showCondition = true) {
            return getLabelledColumn(name, width, showCondition, true);
        }

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
                    noDataMessage={translate('noData')}
                >
                    <DataTable.Column label="" width="43px" />
                    {getLabelledNamedColumn('blueprint_id', '150%', !data.blueprintId && !data.deploymentId)}
                    {getLabelledNamedColumn('deployment_display_name', '150%')}
                    {getLabelledNamedColumn('deployment_id', '150%', !data.deploymentId)}
                    {getLabelledNamedColumn('workflow_id', '200%')}
                    {getLabelledNamedColumn('id', '10%')}
                    {getLabelledNamedColumn('created_at', '110%')}
                    {getLabelledNamedColumn('scheduled_for')}
                    {getLabelledNamedColumn('ended_at')}
                    {getLabelledNamedColumn('created_by')}
                    {getLabelledColumn('attributes')}
                    {getLabelledColumn('status', '150%')}
                    <DataTable.Column width="40px" show={fieldsToShow.indexOf('Actions') >= 0} />

                    {data.items.map(item => {
                        const getActionMenuItem = (
                            action: typeof ExecutionsTable.MenuAction[keyof typeof ExecutionsTable.MenuAction],
                            icon: MenuItemProps['icon']
                        ) => (
                            <Menu.Item
                                content={translateActionMenu(camelCase(action))}
                                icon={icon}
                                name={action}
                                onClick={this.getActionMenuItemClickHandler(item)}
                            />
                        );

                        return (
                            <DataTable.RowExpandable key={item.id} expanded={item.isSelected}>
                                <DataTable.Row
                                    key={item.id}
                                    selected={item.isSelected}
                                    onClick={() => this.selectExecution(item)}
                                    onMouseOver={() => this.setHoveredExecution(item.id)}
                                    onMouseOut={() => this.unsetHoveredExecution(item.id)}
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
                                    <DataTable.Data textAlign="center">
                                        <SystemWorkflowIcon execution={item} />
                                        <DryRunIcon execution={item} />
                                    </DataTable.Data>
                                    <DataTable.Data textAlign="center">
                                        <ExecutionStatus execution={item} />
                                    </DataTable.Data>
                                    <DataTable.Data textAlign="center">
                                        <PopupMenu className="menuAction">
                                            <Menu pointing vertical>
                                                {getActionMenuItem(MenuAction.SHOW_EXECUTION_PARAMETERS, 'options')}
                                                {Utils.Execution.isUpdateExecution(item) &&
                                                    getActionMenuItem(MenuAction.SHOW_UPDATE_DETAILS, 'magnify')}
                                                {Utils.Execution.isFailedExecution(item) &&
                                                    getActionMenuItem(
                                                        MenuAction.SHOW_ERROR_DETAILS,
                                                        <Icon name="exclamation circle" color="red" />
                                                    )}
                                                {(Utils.Execution.isCancelledExecution(item) ||
                                                    Utils.Execution.isFailedExecution(item)) &&
                                                    getActionMenuItem(
                                                        MenuAction.RESUME_EXECUTION,
                                                        <Icon name="play" color="green" />
                                                    )}
                                                {(Utils.Execution.isActiveExecution(item) ||
                                                    Utils.Execution.isWaitingExecution(item)) &&
                                                    getActionMenuItem(MenuAction.CANCEL_EXECUTION, 'cancel')}
                                                {(Utils.Execution.isActiveExecution(item) ||
                                                    Utils.Execution.isWaitingExecution(item)) &&
                                                    getActionMenuItem(
                                                        MenuAction.FORCE_CANCEL_EXECUTION,
                                                        <Icon name="cancel" color="red" />
                                                    )}
                                                {getActionMenuItem(
                                                    MenuAction.KILL_CANCEL_EXECUTION,
                                                    <Icon name="stop" color="red" />
                                                )}
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
                    onClose={() => this.setState({ execution: undefined, executionParametersModalOpen: false })}
                >
                    <Modal.Header>{translateParametersModal('header')}</Modal.Header>
                    <Modal.Content scrolling>
                        {!_.isEmpty(execution.parameters) ? (
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>
                                            {translateParametersModalColumns('parameter')}
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            {translateParametersModalColumns('value')} <ParameterValueDescription />
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {_.map(_.keys(execution.parameters), parameterName => (
                                        <Table.Row key={parameterName}>
                                            <Table.Cell>{parameterName}</Table.Cell>
                                            <Table.Cell>
                                                <ParameterValue value={execution.parameters?.[parameterName]} />
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        ) : (
                            <span>{translateParametersModal('noParametersMessage')}</span>
                        )}
                    </Modal.Content>
                    <Modal.Actions>
                        <CopyToClipboardButton
                            content={translateParametersModalActions('copy')}
                            text={JSON.stringify(execution.parameters, null, 2)}
                        />
                        <CancelButton
                            onClick={e => {
                                e.stopPropagation();
                                this.setState({ executionParametersModalOpen: false });
                            }}
                            content={translateParametersModalActions('close')}
                        />
                    </Modal.Actions>
                </Modal>

                <UpdateDetailsModal
                    open={deploymentUpdateModalOpen}
                    deploymentUpdateId={deploymentUpdateId}
                    onClose={() =>
                        this.setState({
                            execution: undefined,
                            deploymentUpdateId: '',
                            deploymentUpdateModalOpen: false
                        })
                    }
                    toolbox={toolbox}
                />

                <Modal
                    open={errorModalOpen}
                    onClose={() => this.setState({ execution: undefined, errorModalOpen: false })}
                >
                    <Modal.Header>{translateErrorModal('header')}</Modal.Header>
                    <Modal.Content scrolling>
                        <HighlightText language="python">{execution.error}</HighlightText>
                    </Modal.Content>
                    <Modal.Actions>
                        <CopyToClipboardButton content={translateErrorModalActions('copy')} text={execution.error} />
                        <CancelButton
                            onClick={e => {
                                e.stopPropagation();
                                this.setState({ errorModalOpen: false });
                            }}
                            content={translateErrorModalActions('close')}
                        />
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}
