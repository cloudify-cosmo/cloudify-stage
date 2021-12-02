// @ts-nocheck File not migrated fully to TS
import GraphEdgePropType from './props/GraphEdgePropType';
import GraphEdge from './GraphEdge';

/**
 * @property {Array} [graphEdges] - Array of Graph Edges to render
 */

const GraphEdges = props => props.graphEdges.map(graphEdge => <GraphEdge key={graphEdge.id} graphEdge={graphEdge} />);

GraphEdges.propTypes = {
    graphEdges: PropTypes.arrayOf(GraphEdgePropType)
};
GraphEdges.defaultProps = {
    graphEdges: []
};

export default GraphEdges;
