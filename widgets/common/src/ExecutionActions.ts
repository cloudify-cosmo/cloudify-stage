export {};

class ExecutionActions {
    constructor(private toolbox: Stage.Types.Toolbox) {}

    doGetExecutions(deploymentId: string) {
        return this.toolbox
            .getManager()
            .doGet('/executions?_include=id,status,ended_at', { params: { deployment_id: deploymentId } });
    }

    doGetStatus(executionId: string) {
        return this.toolbox.getManager().doGet('/executions?_include=id,status', { params: { id: executionId } });
    }

    // eslint-disable-next-line camelcase
    doAct(execution: { id: string; deployment_id: string }, action: any) {
        return this.toolbox.getManager().doPost(`/executions/${execution.id}`, {
            body: {
                deployment_id: execution.deployment_id,
                action
            }
        });
    }
}

declare global {
    namespace Stage.Common {
        // eslint-disable-next-line import/prefer-default-export
        export { ExecutionActions };
    }
}

Stage.defineCommon({
    name: 'ExecutionActions',
    common: ExecutionActions
});
