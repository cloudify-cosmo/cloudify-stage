// @ts-nocheck File not migrated fully to TS

import _ from 'lodash';

export default class ExecutionUtils {
    /* Execution resume types */
    static FORCE_RESUME_ACTION = 'force-resume';

    static RESUME_ACTION = 'resume';

    /* Execution cancellation types */
    static CANCEL_ACTION = 'cancel';

    static FORCE_CANCEL_ACTION = 'force-cancel';

    static KILL_CANCEL_ACTION = 'kill';

    /* Execution status groups */
    static EXECUTION_SUCCESSFUL = 'success';

    static EXECUTION_FAILED = 'failed';

    static EXECUTION_CANCELLED = 'cancelled';

    static EXECUTION_WAITING = 'waiting';

    static EXECUTION_IN_PROGRESS = 'inprogress';

    static STATUS_ICON_PARAMS = {
        [ExecutionUtils.EXECUTION_SUCCESSFUL]: {
            name: 'checkmark',
            color: 'green',
            loading: false
        },
        [ExecutionUtils.EXECUTION_FAILED]: {
            name: 'remove',
            color: 'red',
            loading: false
        },
        [ExecutionUtils.EXECUTION_CANCELLED]: {
            name: 'ban',
            color: 'orange',
            loading: false
        },
        [ExecutionUtils.EXECUTION_WAITING]: {
            name: 'clock',
            color: 'black',
            loading: false
        },
        [ExecutionUtils.EXECUTION_IN_PROGRESS]: {
            name: 'spinner',
            color: 'yellow',
            loading: true
        }
    };

    /* Execution statuses */
    static EXECUTION_STATUSES = [
        'terminated',
        'failed',
        'cancelled',
        'scheduled',
        'queued',
        'pending',
        'started',
        'cancelling',
        'force_cancelling',
        'kill_cancelling'
    ];

    static WAITING_EXECUTION_STATUSES = ['scheduled', 'queued'];

    static END_EXECUTION_STATUSES = ['terminated', 'failed', 'cancelled'];

    static ACTIVE_EXECUTION_STATUSES = _.difference(ExecutionUtils.EXECUTION_STATUSES, [
        ...ExecutionUtils.END_EXECUTION_STATUSES,
        ...ExecutionUtils.WAITING_EXECUTION_STATUSES
    ]);

    static UPDATE_WORKFLOW_ID = 'update';

    /* Helper methods */
    static isCancelledExecution(execution) {
        return execution.status === 'cancelled';
    }

    static isWaitingExecution(execution) {
        return _.includes(ExecutionUtils.WAITING_EXECUTION_STATUSES, execution.status);
    }

    static isFailedExecution(execution) {
        return execution.status === 'failed';
    }

    static isSuccessfulExecution(execution) {
        return execution.status === 'terminated';
    }

    static isUpdateExecution(execution) {
        return execution.workflow_id === ExecutionUtils.UPDATE_WORKFLOW_ID;
    }

    static isActiveExecution(execution) {
        return _.includes(ExecutionUtils.ACTIVE_EXECUTION_STATUSES, execution.status);
    }

    static getExecutionStatusGroup(execution) {
        if (ExecutionUtils.isFailedExecution(execution)) {
            return ExecutionUtils.EXECUTION_FAILED;
        }
        if (ExecutionUtils.isSuccessfulExecution(execution)) {
            return ExecutionUtils.EXECUTION_SUCCESSFUL;
        }
        if (ExecutionUtils.isCancelledExecution(execution)) {
            return ExecutionUtils.EXECUTION_CANCELLED;
        }
        if (ExecutionUtils.isWaitingExecution(execution)) {
            return ExecutionUtils.EXECUTION_WAITING;
        }
        return ExecutionUtils.EXECUTION_IN_PROGRESS;
    }

    static getExecutionStatusIconParams(execution) {
        return ExecutionUtils.STATUS_ICON_PARAMS[ExecutionUtils.getExecutionStatusGroup(execution)];
    }

    /**
     * @param {{ total_operations: number, finished_operations: number }} execution
     */
    static getProgress(execution) {
        const { finished_operations: finishedOperations, total_operations: totalOperations } = execution;
        const ratio = finishedOperations / totalOperations;
        return Number.isFinite(ratio) ? Math.round(ratio * 100) : 0;
    }
}
