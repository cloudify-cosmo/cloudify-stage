/**
 * Created by jakub.niezgoda on 27/09/2018.
 */

export default class LastExecutionStatusIcon extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            errorModalOpen: false,
            open: false
        };
    }

    static propTypes = {
        execution: PropTypes.object,
        onShowLogs: PropTypes.func,
        onShowUpdateDetails: PropTypes.func,
        onActOnExecution: PropTypes.func,
        showLabel: PropTypes.bool,
        labelAttached: PropTypes.bool
    };

    static defaultProps = {
        execution: { workflow_id: '', status: '' },
        onShowLogs: _.noop,
        onShowUpdateDetails: _.noop,
        onActOnExecution: _.noop,
        showLabel: false,
        labelAttached: true
    };

    render() {
        const { CancelButton, Button, CopyToClipboardButton, HighlightText, Icon, Table, Modal, Popup } = Stage.Basic;
        const { ExecutionStatus } = Stage.Shared;
        const { Utils } = Stage;
        const execution = { workflow_id: '', status: '', ...this.props.execution };

        const showScheduledColumn = !!execution.scheduled_for;
        const colSpan = showScheduledColumn ? 5 : 4;

        return !_.isEmpty(execution.status) ? (
            <>
                <Popup
                    wide="very"
                    on="hover"
                    hoverable
                    open={this.state.open}
                    onOpen={() => this.setState({ open: true })}
                    onClose={() => this.setState({ open: false })}
                    onClick={e => {
                        e.stopPropagation();
                        this.setState({ open: false });
                    }}
                >
                    <Popup.Trigger>
                        <div style={{ display: 'inline-block' }}>
                            <ExecutionStatus
                                execution={execution}
                                allowShowingPopup={false}
                                showLabel={this.props.showLabel}
                                showWorkflowId={this.props.showLabel}
                                labelProps={{ attached: this.props.labelAttached ? 'top left' : undefined }}
                                iconProps={{ attached: this.props.showLabel ? undefined : 'top left', size: 'large' }}
                            />
                        </div>
                    </Popup.Trigger>

                    <Popup.Header>Last Execution</Popup.Header>

                    <Popup.Content>
                        <Table compact celled>
                            <Table.Header>
                                <Table.Row textAlign="center">
                                    <Table.HeaderCell>Workflow</Table.HeaderCell>
                                    <Table.HeaderCell>Status</Table.HeaderCell>
                                    <Table.HeaderCell>Created</Table.HeaderCell>
                                    {showScheduledColumn && <Table.HeaderCell>Scheduled</Table.HeaderCell>}
                                    <Table.HeaderCell>Ended</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                <Table.Row textAlign="center">
                                    <Table.Cell>{execution.workflow_id}</Table.Cell>
                                    <Table.Cell>{execution.status_display || execution.status}</Table.Cell>
                                    <Table.Cell>{Stage.Utils.Time.formatTimestamp(execution.created_at)}</Table.Cell>
                                    {showScheduledColumn && (
                                        <Table.Cell>
                                            {Stage.Utils.Time.formatTimestamp(execution.scheduled_for)}
                                        </Table.Cell>
                                    )}
                                    <Table.Cell>{Stage.Utils.Time.formatTimestamp(execution.ended_at)}</Table.Cell>
                                </Table.Row>
                            </Table.Body>

                            <Table.Footer fullWidth>
                                <Table.Row textAlign="center">
                                    <Table.HeaderCell colSpan={colSpan}>
                                        {Utils.Execution.isFailedExecution(execution) && (
                                            <Button
                                                icon
                                                labelPosition="left"
                                                color="red"
                                                onClick={() => this.setState({ errorModalOpen: true })}
                                            >
                                                <Icon name="remove" />
                                                Show Error
                                            </Button>
                                        )}
                                        <Button icon labelPosition="left" color="grey" onClick={this.props.onShowLogs}>
                                            <Icon name="file text" />
                                            Show Logs
                                        </Button>
                                        {Utils.Execution.isUpdateExecution(execution) && (
                                            <Button
                                                icon
                                                labelPosition="left"
                                                color="blue"
                                                onClick={() =>
                                                    this.props.onShowUpdateDetails(
                                                        _.get(execution, 'parameters.update_id')
                                                    )
                                                }
                                            >
                                                <Icon name="magnify" />
                                                Show Update Details
                                            </Button>
                                        )}
                                    </Table.HeaderCell>
                                </Table.Row>
                                <Table.Row textAlign="center">
                                    <Table.HeaderCell colSpan={colSpan}>
                                        {(Utils.Execution.isCancelledExecution(execution) ||
                                            Utils.Execution.isFailedExecution(execution)) && (
                                            <Button
                                                icon
                                                labelPosition="left"
                                                color="green"
                                                onClick={() =>
                                                    this.props.onActOnExecution(
                                                        execution,
                                                        Utils.Execution.FORCE_RESUME_ACTION
                                                    )
                                                }
                                            >
                                                <Icon name="play" />
                                                Resume
                                            </Button>
                                        )}
                                        {(Utils.Execution.isActiveExecution(execution) ||
                                            Utils.Execution.isWaitingExecution(execution)) && (
                                            <Button
                                                icon
                                                labelPosition="left"
                                                color="yellow"
                                                onClick={() =>
                                                    this.props.onActOnExecution(
                                                        execution,
                                                        Utils.Execution.CANCEL_ACTION
                                                    )
                                                }
                                            >
                                                <Icon name="cancel" />
                                                Cancel
                                            </Button>
                                        )}
                                        {(Utils.Execution.isActiveExecution(execution) ||
                                            Utils.Execution.isWaitingExecution(execution)) && (
                                            <Button
                                                icon
                                                labelPosition="left"
                                                color="orange"
                                                onClick={() =>
                                                    this.props.onActOnExecution(
                                                        execution,
                                                        Utils.Execution.FORCE_CANCEL_ACTION
                                                    )
                                                }
                                            >
                                                <Icon name="cancel" />
                                                Force Cancel
                                            </Button>
                                        )}
                                        <Button
                                            icon
                                            labelPosition="left"
                                            color="red"
                                            onClick={() =>
                                                this.props.onActOnExecution(
                                                    execution,
                                                    Utils.Execution.KILL_CANCEL_ACTION
                                                )
                                            }
                                        >
                                            <Icon name="stop" />
                                            Kill Cancel
                                        </Button>
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Footer>
                        </Table>
                    </Popup.Content>
                </Popup>
                {Utils.Execution.isFailedExecution(execution) && (
                    <Modal open={this.state.errorModalOpen} onClose={() => this.setState({ errorModalOpen: false })}>
                        <Modal.Header>
                            Error message from '{execution.workflow_id}' worfklow execution on '
                            {execution.deployment_id}' deployment
                        </Modal.Header>
                        <Modal.Content>
                            <HighlightText>{execution.error}</HighlightText>
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
                )}
            </>
        ) : null;
    }
}

Stage.defineCommon({
    name: 'LastExecutionStatusIcon',
    common: LastExecutionStatusIcon
});
