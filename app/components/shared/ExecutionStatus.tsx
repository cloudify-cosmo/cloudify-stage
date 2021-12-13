import _ from 'lodash';
import React, { memo } from 'react';
import type { FunctionComponent, MouseEvent } from 'react';
import type { SemanticICONS, SemanticCOLORS, StrictIconProps, StrictLabelProps } from 'semantic-ui-react';
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

interface Execution {
    // eslint-disable-next-line camelcase
    status_display?: string;
    status?: string;
    // eslint-disable-next-line camelcase
    scheduled_for?: string;
    // eslint-disable-next-line camelcase
    workflow_id?: string;
}

interface ExecutionStatusProps {
    execution: Execution;
    allowShowingPopup?: boolean;
    labelAttached?: StrictLabelProps['attached'];
    iconAttached?: string;
    iconSize?: StrictIconProps['size'];
    showLabel?: boolean;
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
