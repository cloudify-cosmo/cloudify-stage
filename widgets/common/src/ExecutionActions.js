/**
 * Created by jakubniezgoda on 27/01/2017.
 */

class ExecutionActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGetExecutions(deploymentId) {
        return this.toolbox
            .getManager()
            .doGet('/executions?_include=id,status,ended_at', { deployment_id: deploymentId });
    }

    doGetStatus(executionId) {
        return this.toolbox.getManager().doGet('/executions?_include=id,status', { id: executionId });
    }

    doAct(execution, action) {
        return this.toolbox.getManager().doPost(`/executions/${execution.id}`, null, {
            deployment_id: execution.deployment_id,
            action
        });
    }
}

Stage.defineCommon({
    name: 'ExecutionActions',
    common: ExecutionActions
});
