import type { ElkLabel, ElkNode } from 'elkjs';

export interface ExecutionGraphLabel extends ElkLabel {
    displayTitle?: string[];
    displayText?: string[];
    state?: string;
    retry?: number;
    type?: string;
    operation?: string;
}

export interface ExecutionGraphNode extends ElkNode {
    nodeInstanceId?: string;
    operation?: string;
    containingSubgraph?: string;
    labels: ExecutionGraphLabel[];
    children: ExecutionGraphNode[];
}

export interface Operation {
    id: string;
    name?: string;
    type?: string;
    state?: string;
    parameters: {
        /* eslint-disable camelcase */
        task_kwargs: {
            cloudify_context?: { operation?: Operation };
            kwargs?: unknown;
        };
        containing_subgraph?: string;
        current_retries: number;
        retried_task?: unknown;
        /* eslint-enable camelcase */
    };
    dependencies: unknown[];
}
