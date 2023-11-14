import type { ExecutionGraphNode } from '../handler/ExecutionsHandler.types';

export type ExecutionGraphResponse = Omit<ExecutionGraphNode, 'labels'>;
