/**
 * Created by jakubniezgoda on 27/01/2017.
 */

import { Constants } from './utils';

export default class {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doCancel(execution,force) {
        return this.toolbox.getManager().doPost(`/executions/${execution.id}`, null, {
            'deployment_id': execution.deployment_id,
            'action': force ? Constants.EXECUTION_FORCE_CANCEL_ACTION : Constants.EXECUTION_CANCEL_ACTION
        });
    }
}