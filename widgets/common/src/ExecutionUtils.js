/**
 * Created by jakubniezgoda on 31/01/2017.
 */

class ExecutionUtils {
    static CANCEL_ACTION = 'cancel';
    static FORCE_CANCEL_ACTION = 'force-cancel';
    static KILL_CANCEL_ACTION = 'kill';

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
        const EXECUTION_STATES = [ 'terminated', 'failed', 'cancelled', 'pending', 'started', 'cancelling', 'force_cancelling', 'kill_cancelling' ];
        const END_EXECUTION_STATES = [ 'terminated', 'failed', 'cancelled' ];
        const ACTIVE_EXECUTION_STATES = _.difference(EXECUTION_STATES, END_EXECUTION_STATES);

        return _.includes(ACTIVE_EXECUTION_STATES, execution.status);
    }
};

Stage.defineCommon({
    name: 'ExecutionUtils',
    common: ExecutionUtils
});