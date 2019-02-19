/**
 * Created by barucoh on 23/1/2019.
 */
import PropTypes from 'prop-types';

export default class GraphNode extends React.Component {
    /**
     * @property {Any} [graphNode] - A Graph Node to render
     */
    static propTypes = {
        graphNode: PropTypes.any.isRequired
    };
    constructor(props, context) {
        super(props, context);
        this.state = {
            graphNode: props.graphNode
        };
    }
    render() {
        let stateAndRetry = undefined;
        if (this.props.graphNode.labels && this.props.graphNode.labels[0].state) {
            stateAndRetry = this.props.graphNode.labels[0].state;
            if (this.props.graphNode.labels[0].retry) {
               stateAndRetry += ` - retry count ${this.props.graphNode.labels[0].retry}`;
            }
        }
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
                    fontSize="15px"
                    fontStyle="normal"
                    transform={
                        this.props.graphNode.children && this.props.graphNode.children.length === 0 ?
                        `translate(10, ${(this.props.graphNode.height / 2) - 5})` :
                        `translate(0, -5)`
                    }
                >
                    {this.props.graphNode.labels ? this.props.graphNode.labels[0].text : 'No text'}
                </text>
                {
                    stateAndRetry !== undefined && 
                    <text
                        fontSize="13px"
                        transform={
                            `translate(10, ${(this.props.graphNode.height / 2) + 13})`
                        }
                    >
                        {stateAndRetry}
                    </text>
                }
            </g>
        )
    }
}