/**
 * Created by barucoh on 23/1/2019.
 */
import GraphEdge from './GraphEdge';

export default class GraphEdges extends React.Component {
    /**
     * @property {Any} [graphEdges] - Array of Graph Edges to render
     */
    /*static propTypes = {
        graphEdges: PropTypes.any.isRequired,
    };*/
    constructor(props, context) {
        super(props, context);
        this.state = {
            graphEdges: props.graphEdges
        };
    }
    render() {
        return (
            this.state.graphEdges.map((graphEdge) => {
                return (
                    <GraphEdge key={graphEdge.id} graphEdge={graphEdge} />
                )
            })
        )
    }
}