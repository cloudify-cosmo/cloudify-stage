/**
 * Created by jakubniezgoda on 27/01/2017.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from 'i18next';
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
    labelAttached,
    iconAttached,
    iconSize,
    showLabel,
    showWorkflowId
}) {
    const executionStatusDisplay = execution.status_display || execution.status;
    const showPopup =
        allowShowingPopup && ExecutionUtils.isWaitingExecution(execution) && !_.isEmpty(execution.scheduled_for);

    function renderIcon(onClick) {
        const iconParams = ExecutionUtils.getExecutionStatusIconParams(execution);
        return (
            <Icon
                name={iconParams.name}
                color={iconParams.color}
                loading={iconParams.loading}
                size={iconSize}
                attached={iconAttached}
                onClick={onClick}
            />
        );
    }

    return showLabel ? (
        <Popup on={showPopup ? 'hover' : []}>
            <Popup.Trigger>
                <Label attached={labelAttached} onClick={e => e.stopPropagation()}>
                    {renderIcon()}
                    {showWorkflowId && execution.workflow_id}
                    {showWorkflowId && ' '}
                    {executionStatusDisplay}
                </Label>
            </Popup.Trigger>
            {showPopup ? (
                <span
                    dangerouslySetInnerHTML={{
                        __html: i18n.t(
                            'shared.executionStatus.scheduledFor',
                            'Scheduled for: <strong>{{datetime}}}</strong>',
                            { datetime: execution.scheduled_for }
                        )
                    }}
                />
            ) : null}
        </Popup>
    ) : (
        renderIcon(e => e.stopPropagation())
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
     * Icon size
     */
    iconSize: PropTypes.string,

    /**
     * Defines how the icon should be attached to a content segment
     */
    iconAttached: PropTypes.string,

    /**
     * Defines how the label should be attached to a content segment
     */
    labelAttached: PropTypes.string,

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
    iconSize: undefined,
    iconAttached: undefined,
    labelAttached: undefined,
    showLabel: true,
    showWorkflowId: false
};
