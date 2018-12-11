/**
 * Created by jakubniezgoda on 31/01/2017.
 */

class ExecutionUtils {
    /* Execution cancellation types */
    static CANCEL_ACTION = 'cancel';
    static FORCE_CANCEL_ACTION = 'force-cancel';
    static KILL_CANCEL_ACTION = 'kill';

    /* Execution status groups */
    static EXECUTION_SUCCESSFUL = 'success';
    static EXECUTION_FAILED = 'failed';
    static EXECUTION_CANCELLED = 'cancelled';
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
        [ExecutionUtils.EXECUTION_IN_PROGRESS]: {
            name: 'spinner',
            color: 'yellow',
            loading: true
        }
    };

    /* Execution statuses */
    static EXECUTION_STATUSES
        = ['terminated', 'failed', 'cancelled', 'pending', 'started', 'cancelling', 'force_cancelling', 'kill_cancelling'];
    static END_EXECUTION_STATUSES
        = [ 'terminated', 'failed', 'cancelled' ];
    static ACTIVE_EXECUTION_STATUSES
        = _.difference(ExecutionUtils.EXECUTION_STATUSES, ExecutionUtils.END_EXECUTION_STATUSES);

    /* Helper methods */
    static isCancelledExecution(execution) {
        return execution.status === 'cancelled';
    }

    static isFailedExecution(execution) {
        return execution.status === 'failed';
    }

    static isSuccessfulExecution(execution) {
        return execution.status === 'terminated';
    }

    static isUpdateExecution(execution) {
        return execution.workflow_id === 'update';
    }

    static isActiveExecution(execution) {
        return _.includes(ExecutionUtils.ACTIVE_EXECUTION_STATUSES, execution.status);
    }

    static getExecutionStatusGroup(execution) {
        if (ExecutionUtils.isFailedExecution(execution)) {
            return ExecutionUtils.EXECUTION_FAILED;
        } else if (ExecutionUtils.isSuccessfulExecution(execution)) {
            return ExecutionUtils.EXECUTION_SUCCESSFUL;
        } else if (ExecutionUtils.isCancelledExecution(execution)) {
            return ExecutionUtils.EXECUTION_CANCELLED;
        } else {
            return ExecutionUtils.EXECUTION_IN_PROGRESS;
        }
    }

    static getExecutionStatusIconParams(execution) {
        return ExecutionUtils.STATUS_ICON_PARAMS[ExecutionUtils.getExecutionStatusGroup(execution)];
    }
}

Stage.defineCommon({
    name: 'ExecutionUtils',
    common: ExecutionUtils
});