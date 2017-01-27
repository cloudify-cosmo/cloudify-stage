/**
 * Created by jakubniezgoda on 27/01/2017.
 */

export default class {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doCancel(execution,force) {
        return this.toolbox.getManager().doPost(`/executions/${execution.id}`, null, {
            'deployment_id': execution.deployment_id,
            'action': force ? 'force-cancel' : 'cancel'
        });
    }
}