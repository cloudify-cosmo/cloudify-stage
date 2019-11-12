/**
 * Created by barucoh on 23/1/2019.
 */
import GraphNode from './GraphNode';
import GraphEdges from './GraphEdges';

/**
 * @property {Array} [graphNodes] - Array of Graph Nodes to render
 */

const textVisualAdjustment = 5;

const GraphNodes = props =>
    props.graphNodes.map(graphNode => (
        <g key={graphNode.id} transform={`translate(${graphNode.x}, ${graphNode.y + textVisualAdjustment})`}>
            <GraphNode graphNode={graphNode} />
            {!_.isEmpty(graphNode.children) && (
                <>
                    <GraphNodes graphNodes={graphNode.children} />
                    <GraphEdges graphEdges={graphNode.edges} />
                </>
            )}
        </g>
    ));

GraphNodes.propTypes = {
    graphNodes: PropTypes.arrayOf(
        PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
            id: PropTypes.string,
            children: PropTypes.array.isRequired, // While required, may be empty
            edges: PropTypes.array.isRequired // Same as above
        })
    ).isRequired
};

export default GraphNodes;
