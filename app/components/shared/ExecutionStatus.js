/**
 * Created by jakubniezgoda on 27/01/2017.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Icon, Label, Popup } from '../basic';
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
export default function ExecutionStatus({
    execution,
    allowShowingPopup,
    iconProps,
    labelProps,
    showLabel,
    showWorkflowId
}) {
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

ExecutionStatus.propTypes = {
    /**
     * Execution resource object
     */
    execution: PropTypes.shape({
        status_display: PropTypes.string,
        status: PropTypes.string,
        scheduled_for: PropTypes.string,
        workflow_id: PropTypes.string
    }).isRequired,

    /**
     * If set to true and execution is in one of the waiting states, then popup will be shown on hovering execution status label displaying scheduled_for value
     */
    allowShowingPopup: PropTypes.bool,

    /**
     * Props to be passed to Icon component
     */
    iconProps: PropTypes.shape({}),

    /**
     * Props to be passed to Label component
     */
    labelProps: PropTypes.shape({}),

    /**
     * If set to true, then execution status will be added to label
     */
    showLabel: PropTypes.bool,

    /**
     * If set to true, then workflow ID will be added to label
     */
    showWorkflowId: PropTypes.bool
};

ExecutionStatus.defaultProps = {
    allowShowingPopup: true,
    iconProps: {},
    labelProps: {},
    showLabel: true,
    showWorkflowId: false
};
