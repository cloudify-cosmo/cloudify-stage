/**
 * Created by jakub.niezgoda on 27/09/2018.
 */

import PropTypes from 'prop-types';

const executionSuccessful = 'success';
const executionFailed = 'failed';
const executionCancelled = 'cancelled';
const executionInProgress = 'inprogress';
const statusParams = {
    [executionSuccessful]: {
        icon: 'checkmark',
        color: 'green',
        loading: false
    },
    [executionFailed]: {
        icon: 'remove',
        color: 'red',
        loading: false
    },
    [executionCancelled]: {
        icon: 'ban',
        color: 'orange',
        loading: false
    },
    [executionInProgress]: {
        icon: 'spinner',
        color: 'yellow',
        loading: true
    }
};

export default class LastExecutionStatusIcon extends React.Component {

    constructor(props, context){
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
        onCancelExecution: PropTypes.func,
        showLabel: PropTypes.bool,
        labelAttached: PropTypes.bool
    };

    static defaultProps = {
        execution: {workflow_id: '', status: ''},
        onShowLogs: _.noop,
        onShowUpdateDetails: _.noop,
        onCancelExecution: _.noop,
        showLabel: false,
        labelAttached: true
    };

    render() {
        let {Button, CopyToClipboardButton, HighlightText, Icon, Label, Table, Modal, Popup} = Stage.Basic;
        let {ExecutionUtils} = Stage.Common;
        let execution = {workflow_id: '', status: '', ...this.props.execution};

        let status = '';
        if (ExecutionUtils.isFailedExecution(execution)) {
            status = executionFailed;
        } else if (ExecutionUtils.isSuccessfulExecution(execution)) {
            status = executionSuccessful;
        } else if (ExecutionUtils.isCancelledExecution(execution)) {
            status = executionCancelled;
        } else {
            status = executionInProgress;
        }

        return !_.isEmpty(status)
            ?
                <React.Fragment>
                    <Popup flowing on='hover' hoverable open={this.state.open}
                           onOpen={() => this.setState({open: true})} onClose={() => this.setState({open: false})}
                           onClick={() => this.setState({open: false})}>
                        <Popup.Trigger>
                            {
                                this.props.showLabel
                                    ?
                                    <Label attached={this.props.labelAttached ? 'top left' : undefined}>
                                        <Icon name={statusParams[status].icon} color={statusParams[status].color}
                                              loading={statusParams[status].loading} size='large'/>
                                        <span>{execution.workflow_id} {execution.status_display || execution.status}</span>
                                    </Label>
                                    :
                                    <Icon name={statusParams[status].icon} color={statusParams[status].color}
                                          attached='top left'
                                          loading={statusParams[status].loading} size='large'/>
                            }
                        </Popup.Trigger>
                        <Popup.Header>
                            Last Execution
                        </Popup.Header>
                        <Popup.Content>
                            <Table compact celled >
                                <Table.Header>
                                    <Table.Row textAlign='center'>
                                        <Table.HeaderCell>Workflow</Table.HeaderCell>
                                        <Table.HeaderCell>Status</Table.HeaderCell>
                                        <Table.HeaderCell>Created</Table.HeaderCell>
                                        <Table.HeaderCell>Ended</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    <Table.Row textAlign='center'>
                                        <Table.Cell>{execution.workflow_id}</Table.Cell>
                                        <Table.Cell>{execution.status_display || execution.status}</Table.Cell>
                                        <Table.Cell>{Stage.Utils.formatTimestamp(execution.created_at)}</Table.Cell>
                                        <Table.Cell>{Stage.Utils.formatTimestamp(execution.ended_at)}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>

                                <Table.Footer fullWidth>
                                    <Table.Row textAlign='center'>
                                        <Table.HeaderCell colSpan='4'>
                                            {
                                                status === executionFailed &&
                                                <Button icon labelPosition='left' color='red'
                                                        onClick={() => this.setState({errorModalOpen: true})}>
                                                    <Icon name='remove'/>
                                                    Show Error
                                                </Button>
                                            }
                                            <Button icon labelPosition='left' color='grey'
                                                    onClick={this.props.onShowLogs}>
                                                <Icon name='file text' />
                                                Show Logs
                                            </Button>
                                            {
                                                Stage.Common.ExecutionUtils.isUpdateExecution(execution) &&
                                                <Button icon labelPosition='left' color='blue'
                                                        onClick={() => this.props.onShowUpdateDetails(_.get(execution, 'parameters.update_id'))}>
                                                    <Icon name='magnify'/>
                                                    Show Update Details
                                                </Button>
                                            }
                                        </Table.HeaderCell>
                                    </Table.Row>
                                    <Table.Row textAlign='center'>
                                        <Table.HeaderCell colSpan='4'>
                                            {
                                                Stage.Common.ExecutionUtils.isActiveExecution(execution) &&
                                                <Button icon labelPosition='left' color='yellow'
                                                        onClick={() => this.props.onCancelExecution(execution, ExecutionUtils.CANCEL_ACTION)}>
                                                    <Icon name='cancel' />
                                                    Cancel
                                                </Button>
                                            }
                                            {
                                                Stage.Common.ExecutionUtils.isActiveExecution(execution) &&
                                                <Button icon labelPosition='left' color='orange'
                                                        onClick={() => this.props.onCancelExecution(execution, ExecutionUtils.FORCE_CANCEL_ACTION)}>
                                                    <Icon name='cancel' />
                                                    Force Cancel
                                                </Button>
                                            }
                                            <Button icon labelPosition='left' color='red'
                                                    onClick={() => this.props.onCancelExecution(execution, ExecutionUtils.KILL_CANCEL_ACTION)}>
                                                <Icon name='stop' />
                                                Kill Cancel
                                            </Button>
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Footer>
                            </Table>
                        </Popup.Content>
                    </Popup>
                    {
                        status === executionFailed &&
                        <Modal open={this.state.errorModalOpen} onClose={() => this.setState({errorModalOpen: false})}>
                            <Modal.Header>
                                Error message from '{execution.workflow_id}' worfklow execution on '{execution.deployment_id}' deployment
                            </Modal.Header>
                            <Modal.Content>
                                <HighlightText>
                                    {execution.error}
                                </HighlightText>
                            </Modal.Content>
                            <Modal.Actions>
                                <CopyToClipboardButton content='Copy Error' text={execution.error} />
                            </Modal.Actions>
                        </Modal>
                    }
                </React.Fragment>
            :
                null;
    }
}

