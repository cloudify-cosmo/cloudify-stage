import type { Toolbox } from 'app/utils/StageAPI';
import { isEmpty } from 'lodash';
import type { ExecutionGraphNode } from 'backend/handler/ExecutionsHandler.types';
import GraphNode from './GraphNode';
import GraphEdges from './GraphEdges';

const textVisualAdjustment = 5;

const GraphNodes = ({ graphNodes, toolbox }: { graphNodes: ExecutionGraphNode[]; toolbox: Toolbox }) => (
    <>
        {graphNodes.map(graphNode => (
            <g key={graphNode.id} transform={`translate(${graphNode.x}, ${graphNode.y! + textVisualAdjustment})`}>
                <GraphNode graphNode={graphNode} toolbox={toolbox} />
                {!isEmpty(graphNode.children) && (
                    <>
                        <GraphNodes graphNodes={graphNode.children} toolbox={toolbox} />
                        <GraphEdges graphEdges={graphNode.edges ?? []} />
                    </>
                )}
            </g>
        ))}
    </>
);

export default GraphNodes;
