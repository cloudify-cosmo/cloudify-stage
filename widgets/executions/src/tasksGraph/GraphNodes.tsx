// @ts-nocheck File not migrated fully to TS
import GraphNodePropType from './props/GraphNodePropType';
import GraphNode from './GraphNode';
import GraphEdges from './GraphEdges';

/**
 * @property {Array} [graphNodes] - Array of Graph Nodes to render
 */

const textVisualAdjustment = 5;

const GraphNodes = ({ graphNodes, toolbox }) =>
    graphNodes.map(graphNode => (
        <g key={graphNode.id} transform={`translate(${graphNode.x}, ${graphNode.y + textVisualAdjustment})`}>
            <GraphNode graphNode={graphNode} toolbox={toolbox} />
            {!_.isEmpty(graphNode.children) && (
                <>
                    <GraphNodes graphNodes={graphNode.children} toolbox={toolbox} />
                    <GraphEdges graphEdges={graphNode.edges} />
                </>
            )}
        </g>
    ));

GraphNodes.propTypes = {
    graphNodes: PropTypes.arrayOf(GraphNodePropType).isRequired
};

export default GraphNodes;
