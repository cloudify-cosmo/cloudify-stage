/**
 * Created by barucoh on 23/1/2019.
 */
import GraphEdge from './GraphEdge';

/**
 * @property {Array} [graphEdges] - Array of Graph Edges to render
 */

const GraphEdges = props => props.graphEdges.map(graphEdge => <GraphEdge key={graphEdge.id} graphEdge={graphEdge} />);

GraphEdges.propTypes = {
    graphEdges: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string })).isRequired
};

export default GraphEdges;
