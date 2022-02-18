export {};

class ExecutionActions {
    constructor(private toolbox: Stage.Types.Toolbox) {}

    doGet(executionId: string) {
        return this.toolbox.getManager().doGet(`/executions/${executionId}`);
    }

    doGetAll(params: Record<string, any> = {}) {
        return this.toolbox.getManager().doGet('/executions', { params });
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
        export { ExecutionActions };
    }
}

Stage.defineCommon({
    name: 'ExecutionActions',
    common: ExecutionActions
});
