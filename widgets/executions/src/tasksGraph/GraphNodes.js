/**
 * Created by barucoh on 23/1/2019.
 */
import GraphNode from './GraphNode';
import GraphEdges from './GraphEdges';

export default class GraphNodes extends React.Component {
    /**
     * @property {Any} [graphNodes] - Array of Graph Nodes to render
     */
    /*static propTypes = {
        graphNodes: PropTypes.any.isRequired
    };*/
    constructor(props, context) {
        super(props, context);
        this.state = {
            graphNodes: props.graphNodes
        };
    }
    renderChildren(subgraphChildren) {
        if (!subgraphChildren)
            return null;
        else
            return <GraphNodes graphNodes={subgraphChildren} />
    }
    render() {
        return (
            this.props.graphNodes.map((graphNode) => {
                if (graphNode.children && graphNode.children.length !== 0) {
                    return (
                        <g
                            key={graphNode.id}
                            transform={
                                `translate(
                                    ${graphNode.x},
                                    ${graphNode.y + 5}
                                )`}
                        >
                            <GraphNode graphNode={graphNode} />
                            { this.renderChildren(graphNode.children, graphNode) }
                            <GraphEdges graphEdges={graphNode.edges} />
                        </g>
                    )
                }
                else {
                    return (
                        <g
                            key={graphNode.id}
                            transform={
                                `translate(
                                    ${graphNode.x},
                                    ${graphNode.y + 5}
                                )`}
                        >
                            <GraphNode graphNode={graphNode} />
                        </g>
                    )
                }
            })
        )
    }
}