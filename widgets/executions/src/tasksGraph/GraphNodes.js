/**
 * Created by barucoh on 23/1/2019.
 */
import PropTypes from 'prop-types';

import GraphNode from './GraphNode';
import GraphEdges from './GraphEdges';

export default class GraphNodes extends React.Component {
    /**
     * @property {Any} [graphNodes] - Array of Graph Nodes to render
     */
    static propTypes = {
        graphNodes: PropTypes.any.isRequired
    };
    constructor(props, context) {
        super(props, context);
        this.state = {
            graphNodes: props.graphNodes
        };
    }
    render() {
        return (
            this.props.graphNodes.map((graphNode) => 
                <g key={graphNode.id} transform={`translate(${graphNode.x}, ${graphNode.y + 5})`}>
                    <GraphNode graphNode={graphNode} />
                    {
                        !_.isEmpty(graphNode.children) && 
                        <React.Fragment>
                            <GraphNodes graphNodes={graphNode.children} />
                            <GraphEdges graphEdges={graphNode.edges} />
                        </React.Fragment>
                     }
                </g>
            )
        )
    }
}