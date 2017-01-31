/**
 * Created by jakubniezgoda on 31/01/2017.
 */

export function isActiveExecution(execution) {
    const EXECUTION_STATES = [ 'terminated', 'failed', 'cancelled', 'pending', 'started', 'cancelling', 'force_cancelling' ];
    const END_EXECUTION_STATES = [ 'terminated', 'failed', 'cancelled' ];
    const ACTIVE_EXECUTION_STATES = _.difference(EXECUTION_STATES, END_EXECUTION_STATES);

    return _.includes(ACTIVE_EXECUTION_STATES, execution.status);
}
