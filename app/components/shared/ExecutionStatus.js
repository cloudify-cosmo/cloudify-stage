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
 * *
 * ## Usage
 * ### Label with status and worfklow ID
 * ```
 * <ExecutionStatus execution={execution} />
 * ```
 *
 * ### Only icon
 * ```
 * <ExecutionStatus execution={execution} showLabel={false} />
 * ```
 *
 * ### Scheduled execution popup
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
     * @property {boolean} [allowShowingPopup=true] If set to true and execution is in one of the waiting states, then popup will be shown on hovering execution status label displaying scheduled_for value
     * @property {boolean} [showLabel=true] If set to true, then execution status will be added to label
     * @property {boolean} [showWorkflowId=true] If set to true, then workflow ID will be added to label
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
        const { execution, allowShowingPopup, iconProps, labelProps, showLabel, showWorkflowId } = this.props;
        const executionStatusDisplay = execution.status_display || execution.status;
        const showPopup =
            allowShowingPopup && ExecutionUtils.isWaitingExecution(execution) && !_.isEmpty(execution.scheduled_for);

        return showLabel ? (
            <Popup on={showPopup ? 'hover' : []}>
                <Popup.Trigger>
                    <Label {...labelProps} onClick={e => e.stopPropagation()}>
                        <Icon {...ExecutionUtils.getExecutionStatusIconParams(execution)} {...iconProps} />
                        {showWorkflowId && execution.workflow_id}
                        {showWorkflowId && ' '}
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
                {...iconProps}
                onClick={e => e.stopPropagation()}
            />
        );
    }
}
