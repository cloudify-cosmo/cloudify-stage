/**
 * Created by jakubniezgoda on 27/01/2017.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Icon, Label } from 'semantic-ui-react';
import { Popup } from 'cloudify-ui-components';

import ExecutionUtils from '../../utils/shared/ExecutionUtils';

/**
 * ExecutionStatus is a component which shows execution status as icon with optional status and workflow ID strings.
 *
 * ## Access
 * `Stage.Basic.ExecutionStatus`
 *
 * ## Usage
 * ### Label with status and worfklow ID
 * ![ExecutionStatus](manual/asset/ExecutionStatus_0.png)
 * ```
 * <ExecutionStatus execution={execution} />
 * ```
 *
 * ### Only icon
 * ![ExecutionStatus](manual/asset/ExecutionStatus_1.png)
 * ```
 * <ExecutionStatus execution={execution} showLabel={false} />
 * ```
 *
 * ### Scheduled execution popup
 * ![ExecutionStatus](manual/asset/ExecutionStatus_2.png)
 * ```
 * <ExecutionStatus execution={execution} showWorkflowId={false} />
 * ```
 *
 */
export default class ExecutionStatus extends Component {
    /**
     * @property {object} execution Execution resource object
     * @property {object} [labelProps={}] Props to be passed to Label component
     * @property {object} [iconProps={}] Props to be passed to Icon component
     * @property {bool} [allowShowingPopup=true] If set to true and execution is in one of the waiting states, then popup will be shown on hovering execution status label displaying scheduled_for value
     * @property {bool} [showLabel=true] If set to true, then execution status will be added to label
     * @property {bool} [showWorkflowId=true] If set to true, then workflow ID will be added to label
     */
    static propTypes = {
        execution: PropTypes.object.isRequired,

        allowShowingPopup: PropTypes.bool,
        iconProps: PropTypes.object,
        labelProps: PropTypes.object,
        showLabel: PropTypes.bool,
        showWorkflowId: PropTypes.bool
    };

    static defaultProps = {
        allowShowingPopup: true,
        iconProps: {},
        labelProps: {},
        showLabel: true,
        showWorkflowId: false
    };

    render() {
        const { execution } = this.props;
        const executionStatusDisplay = execution.status_display || execution.status;
        const showPopup =
            this.props.allowShowingPopup &&
            ExecutionUtils.isWaitingExecution(execution) &&
            !_.isEmpty(execution.scheduled_for);

        return this.props.showLabel ? (
            <Popup on={showPopup ? 'hover' : []}>
                <Popup.Trigger>
                    <Label {...this.props.labelProps} onClick={e => e.stopPropagation()}>
                        <Icon {...ExecutionUtils.getExecutionStatusIconParams(execution)} {...this.props.iconProps} />
                        {this.props.showWorkflowId && execution.workflow_id}
                        {this.props.showWorkflowId && ' '}
                        {executionStatusDisplay}
                    </Label>
                </Popup.Trigger>
                {showPopup ? (
                    <span>
                        Scheduled for: <strong>{execution.scheduled_for}</strong>
                    </span>
                ) : null}
            </Popup>
        ) : (
            <Icon
                {...ExecutionUtils.getExecutionStatusIconParams(execution)}
                {...this.props.iconProps}
                onClick={e => e.stopPropagation()}
            />
        );
    }
}
