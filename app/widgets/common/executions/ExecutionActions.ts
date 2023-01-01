import type { Manager } from 'cloudify-ui-components/toolbox';

export default class ExecutionActions {
    constructor(private manager: Manager) {}

    doGet(executionId: string) {
        return this.manager.doGet(`/executions/${executionId}`);
    }

    doGetAll(params: Record<string, any> = {}) {
        return this.manager.doGet('/executions', { params });
    }

    doGetStatus(executionId: string) {
        return this.manager.doGet('/executions?_include=id,status', { params: { id: executionId } });
    }

    // eslint-disable-next-line camelcase
    doAct(execution: { id: string; deployment_id: string }, action: any) {
        return this.manager.doPost(`/executions/${execution.id}`, {
            body: {
                deployment_id: execution.deployment_id,
                action
            }
        });
    }
}
