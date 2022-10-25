import _ from 'lodash';
import React, { memo } from 'react';
import type { FunctionComponent, MouseEvent } from 'react';
import type { SemanticICONS, SemanticCOLORS, StrictIconProps, StrictLabelProps } from 'semantic-ui-react';
import i18n from 'i18next';
import { Icon, Label, Popup } from '../basic';
import type { Execution } from '../../utils/shared/ExecutionUtils';
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

interface ExecutionStatusProps {
    /**
     * Execution resource object
     */
    execution: Execution;

    /**
     * If set to true and execution is in one of the waiting states, then popup will be shown on hovering execution status label displaying scheduled_for value
     */
    allowShowingPopup?: boolean;

    /**
     * Defines how the label should be attached to a content segment
     */
    labelAttached?: StrictLabelProps['attached'];

    /**
     * Defines how the icon should be attached to a content segment
     */
    iconAttached?: string;

    /**
     * Icon size
     */
    iconSize?: StrictIconProps['size'];

    /**
     * If set to true, then execution status will be added to label
     */
    showLabel?: boolean;

    /**
     * If set to true, then workflow ID will be added to label
     */
    showWorkflowId?: boolean;
}

const ExecutionStatus: FunctionComponent<ExecutionStatusProps> = ({
    execution,
    allowShowingPopup = true,
    labelAttached,
    iconAttached,
    iconSize,
    showLabel = true,
    showWorkflowId = false
}) => {
    const executionStatusDisplay = execution.status_display || execution.status;
    const showPopup =
        allowShowingPopup && ExecutionUtils.isWaitingExecution(execution) && !_.isEmpty(execution.scheduled_for);

    const stopPropagation = (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
        e.stopPropagation();
    };

    function renderIcon() {
        const iconParams = ExecutionUtils.getExecutionStatusIconParams(execution);
        return (
            <Icon
                name={iconParams.name as SemanticICONS}
                color={iconParams.color as SemanticCOLORS}
                loading={iconParams.loading}
                size={iconSize}
                attached={iconAttached}
                onClick={stopPropagation}
            />
        );
    }

    return showLabel ? (
        <Popup on="hover" disabled={!showPopup}>
            <Popup.Trigger>
                <Label attached={labelAttached} onClick={stopPropagation}>
                    {renderIcon()}
                    {showWorkflowId && `${execution.workflow_id} `}
                    {executionStatusDisplay}
                </Label>
            </Popup.Trigger>
            {showPopup ? (
                <span
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        __html: i18n.t('shared.executionStatus.scheduledFor', { datetime: execution.scheduled_for })
                    }}
                />
            ) : null}
        </Popup>
    ) : (
        renderIcon()
    );
};

export default memo(ExecutionStatus);
