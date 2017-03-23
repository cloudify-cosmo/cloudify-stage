/**
 * Created by jakubniezgoda on 27/01/2017.
 */

export default class {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doCancel(execution,force) {
        let {ExecutionUtils} = Stage.Common;
        return this.toolbox.getManager().doPost(`/executions/${execution.id}`, null, {
            'deployment_id': execution.deployment_id,
            'action': force ? ExecutionUtils.FORCE_CANCEL_ACTION : ExecutionUtils.CANCEL_ACTION
        });
    }
}