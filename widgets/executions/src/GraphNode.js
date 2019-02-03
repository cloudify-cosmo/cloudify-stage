

export default class GraphNode extends React.Component {
    /**
     * @property {Any} [graphNode] - A Graph Node to render
     */
    /*static propTypes = {
        graphNode: PropTypes.any.isRequired
    };*/
    constructor(props, context) {
        super(props, context);
        this.state = {
            graphNode: props.graphNode
        };
    }
    render() {
        return (
            <g
                stroke='black'
            >
                <rect
                    height={this.props.graphNode.height}
                    width={this.props.graphNode.width}
                    fill='white'
                    strokeWidth='2'
                />
                <text
                    transform={
                        this.props.graphNode.children && this.props.graphNode.children.length === 0 ?
                        `translate(10, ${this.props.graphNode.height / 2})` :
                        `translate(0, -5)`
                    }
                >
                    {this.props.graphNode.labels ? this.props.graphNode.labels[0].text : 'No text'}
                </text>
                {
                    this.props.graphNode.labels && this.props.graphNode.labels[0].retry && 
                    <text
                        transform={
                            `translate(10, ${(this.props.graphNode.height / 2) + 13})`
                        }
                    >
                    {this.props.graphNode.labels[0].retry}
                    </text>
                }
            </g>
        )
    }
}