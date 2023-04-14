import React from 'react';
import {
    Button,
    CancelButton,
    CopyToClipboardButton,
    HighlightText,
    Icon,
    Modal,
    Popup,
    Table
} from '../../../components/basic';
import UpdateDetailsModal from '../deployments/UpdateDetailsModal';
import ExecutionActions from './ExecutionActions';
import StageUtils from '../../../utils/stageUtils';
import { ExecutionStatus } from '../../../components/shared';
import type { Execution, ExecutionAction } from '../../../utils/shared/ExecutionUtils';
import ExecutionUtils from '../../../utils/shared/ExecutionUtils';
import TimeUtils from '../../../utils/shared/TimeUtils';

const t = StageUtils.getT('widgets.common.executions');

export interface LatestExecutionStatusIconProps {
    execution?: Execution;
    onActOnExecution?: (execution: Execution, action: ExecutionAction, errorMessage: any) => void;
    showLabel?: boolean;
    labelAttached?: boolean;
    toolbox: Stage.Types.Toolbox;
}

type LatestExecutionStatusIconPropsWithDefaults = LatestExecutionStatusIconProps &
    Required<Pick<LatestExecutionStatusIconProps, 'execution' | 'onActOnExecution' | 'showLabel' | 'labelAttached'>>;

interface LatestExecutionStatusIconState {
    errorModalOpen: boolean;
    open: boolean;
    updateModalOpen: boolean;
}

const defaultProps = {
    execution: { workflow_id: '', status: '', id: '', deployment_id: '' },
    onActOnExecution: _.noop,
    showLabel: false,
    labelAttached: true
};

const defaultState: LatestExecutionStatusIconState = { errorModalOpen: false, updateModalOpen: false, open: false };

export default class LatestExecutionStatusIcon extends React.Component<
    LatestExecutionStatusIconPropsWithDefaults,
    LatestExecutionStatusIconState
> {
    // eslint-disable-next-line react/static-property-placement
    static defaultProps = defaultProps;

    constructor(props: LatestExecutionStatusIconPropsWithDefaults) {
        super(props);
        this.state = defaultState;

        this.actOnExecution = this.actOnExecution.bind(this);
        this.showLogs = this.showLogs.bind(this);
    }

    shouldComponentUpdate(
        nextProps: LatestExecutionStatusIconPropsWithDefaults,
        nextState: LatestExecutionStatusIconState
    ) {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    showLogs() {
        const { execution, toolbox } = this.props;

        toolbox.drillDown(
            toolbox.getWidget(),
            'logs',
            { deploymentId: execution.deployment_id, executionId: execution.id },
            `Execution Logs - ${execution.id}`
        );
    }

    actOnExecution(execution: Execution, action: ExecutionAction) {
        const { onActOnExecution, toolbox } = this.props;
        const actions = new ExecutionActions(toolbox.getManager());
        actions
            .doAct(execution, action)
            .then(() => {
                toolbox.getEventBus().trigger('deployments:refresh');
                toolbox.getEventBus().trigger('executions:refresh');
                onActOnExecution(execution, action, null);
            })
            .catch(err => {
                onActOnExecution(execution, action, err.message);
            });
    }

    render() {
        const { errorModalOpen, open, updateModalOpen } = this.state;
        const { labelAttached, execution: executionProp, showLabel, toolbox } = this.props;
        const execution = { workflow_id: '', status: '', ...executionProp };

        const showScheduledColumn = !!execution.scheduled_for;
        const colSpan = showScheduledColumn ? 5 : 4;

        return !_.isEmpty(execution.status) ? (
            <>
                <Popup
                    wide="very"
                    on="hover"
                    hoverable
                    open={open}
                    onOpen={() => this.setState({ open: true })}
                    onClose={() => this.setState({ open: false })}
                    onClick={(event: React.MouseEvent) => {
                        event.stopPropagation();
                        this.setState({ open: false });
                    }}
                >
                    <Popup.Trigger>
                        <div style={{ display: 'inline-block' }}>
                            <ExecutionStatus
                                execution={execution}
                                allowShowingPopup={false}
                                showLabel={showLabel}
                                showWorkflowId={showLabel}
                                labelAttached={labelAttached ? 'top left' : undefined}
                                iconAttached={showLabel ? undefined : 'top left'}
                                iconSize="large"
                            />
                        </div>
                    </Popup.Trigger>

                    <Popup.Header>Last Execution</Popup.Header>

                    <Popup.Content>
                        <Table compact basic>
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
                                    <Table.Cell>{TimeUtils.formatTimestamp(execution.created_at)}</Table.Cell>
                                    {showScheduledColumn && (
                                        <Table.Cell>{TimeUtils.formatTimestamp(execution.scheduled_for)}</Table.Cell>
                                    )}
                                    <Table.Cell>{TimeUtils.formatTimestamp(execution.ended_at)}</Table.Cell>
                                </Table.Row>
                            </Table.Body>

                            <Table.Footer fullWidth>
                                <Table.Row textAlign="center">
                                    <Table.HeaderCell colSpan={colSpan}>
                                        {ExecutionUtils.isFailedExecution(execution) && (
                                            <Button
                                                icon
                                                color="teal"
                                                labelPosition="left"
                                                onClick={() => this.setState({ errorModalOpen: true })}
                                            >
                                                <Icon name="remove" />
                                                Show Error
                                            </Button>
                                        )}
                                        <Button icon color="teal" labelPosition="left" onClick={this.showLogs}>
                                            <Icon name="file text" />
                                            Show Logs
                                        </Button>
                                        {ExecutionUtils.isUpdateExecution(execution) && (
                                            <Button
                                                icon
                                                color="teal"
                                                labelPosition="left"
                                                onClick={() => this.setState({ updateModalOpen: true })}
                                            >
                                                <Icon name="magnify" />
                                                Show Update Details
                                            </Button>
                                        )}
                                    </Table.HeaderCell>
                                </Table.Row>
                                <Table.Row textAlign="center">
                                    <Table.HeaderCell colSpan={colSpan}>
                                        {(ExecutionUtils.isCancelledExecution(execution) ||
                                            ExecutionUtils.isFailedExecution(execution)) && (
                                            <Button
                                                icon
                                                color="teal"
                                                labelPosition="left"
                                                onClick={() =>
                                                    this.actOnExecution(execution, ExecutionUtils.FORCE_RESUME_ACTION)
                                                }
                                            >
                                                <Icon name="play" />
                                                Resume
                                            </Button>
                                        )}
                                        {(ExecutionUtils.isActiveExecution(execution) ||
                                            ExecutionUtils.isWaitingExecution(execution)) && (
                                            <Button
                                                icon
                                                color="teal"
                                                labelPosition="left"
                                                onClick={() =>
                                                    this.actOnExecution(execution, ExecutionUtils.CANCEL_ACTION)
                                                }
                                            >
                                                <Icon name="cancel" />
                                                Cancel
                                            </Button>
                                        )}
                                        {(ExecutionUtils.isActiveExecution(execution) ||
                                            ExecutionUtils.isWaitingExecution(execution)) && (
                                            <Button
                                                icon
                                                color="teal"
                                                labelPosition="left"
                                                onClick={() =>
                                                    this.actOnExecution(execution, ExecutionUtils.FORCE_CANCEL_ACTION)
                                                }
                                            >
                                                <Icon name="cancel" />
                                                Force Cancel
                                            </Button>
                                        )}
                                        <Button
                                            icon
                                            color="teal"
                                            labelPosition="left"
                                            onClick={() =>
                                                this.actOnExecution(execution, ExecutionUtils.KILL_CANCEL_ACTION)
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
                {ExecutionUtils.isFailedExecution(execution) && (
                    <Modal open={errorModalOpen} onClose={() => this.setState({ errorModalOpen: false })}>
                        <Modal.Header>
                            Error message from &apos;{execution.workflow_id}&apos; worfklow execution on &apos;
                            {execution.deployment_id}&apos; deployment
                        </Modal.Header>
                        <Modal.Content>
                            <HighlightText>{execution.error || t('noErrorDetails')}</HighlightText>
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
                {ExecutionUtils.isUpdateExecution(execution) && (
                    <UpdateDetailsModal
                        open={updateModalOpen}
                        deploymentUpdateId={_.get(execution, 'parameter.update_id')}
                        onClose={() => this.setState({ updateModalOpen: false })}
                        toolbox={toolbox}
                    />
                )}
            </>
        ) : null;
    }
}
