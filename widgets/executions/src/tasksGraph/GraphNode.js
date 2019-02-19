/**
 * Created by barucoh on 23/1/2019.
 */
import PropTypes from 'prop-types';
import { throws } from 'assert';

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
        let rectClassName = 'rect-tasks-graph-general';
        let state = undefined;
        if (this.props.graphNode.labels && this.props.graphNode.labels[0].state) {
            state = this.props.graphNode.labels[0].state;
            switch(state) {
                case 'pending':
                    rectClassName += ' rect-tasks-graph-pending';
                    break;
                case 'rescheduled':
                case 'sent':
                    rectClassName += ' rect-tasks-graph-running';
                    break;
                case 'succeeded':
                    rectClassName += ' rect-tasks-graph-succeeded';
                    break;
                case 'failed':
                    rectClassName += ' rect-tasks-graph-failed';
                    break;
            }
            if (this.props.graphNode.labels[0].retry)
                state += ` - retry count ${this.props.graphNode.labels[0].retry}`;
            if (this.props.graphNode.labels[0].operation)
                state = `${this.props.graphNode.labels[0].operation} - ${state}`
        }
        return (
            <g
                className='g-tasks-graph-general'
            >
                <rect
                    height={this.props.graphNode.height}
                    width={this.props.graphNode.width}
                    className={rectClassName}
                />
                <text
                    className='text-tasks-graph-subgraph-title'
                    transform={
                        this.props.graphNode.children && this.props.graphNode.children.length === 0 ? // Placing text according to subgraph tier
                        `translate(10, ${(this.props.graphNode.height / 2) - 5})` :
                        `translate(0, -5)`
                    }
                >
                    {this.props.graphNode.labels ? this.props.graphNode.labels[0].text : 'No text'}
                </text>
                {
                    state !== undefined && 
                    <text
                        className='text-tasks-graph-operation-and-state'
                        transform={
                            `translate(10, ${(this.props.graphNode.height / 2) + 13})`
                        }
                    >
                        {state}
                    </text>
                }
            </g>
        )
    }
}