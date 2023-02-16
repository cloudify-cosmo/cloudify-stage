import type { Manager } from 'cloudify-ui-components/toolbox';
import type { Execution } from 'app/utils/shared/ExecutionUtils';
import type { PaginatedResponse } from 'backend/types';

export default class ExecutionActions {
    constructor(private manager: Manager) {}

    doGet(executionId: string) {
        return this.manager.doGet<Execution>(`/executions/${executionId}`);
    }

    doGetAll<PossibleValues extends keyof Execution>(params: Record<string, any> = {}) {
        return this.manager.doGet<PaginatedResponse<Pick<Execution, PossibleValues>>>('/executions', { params });
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
