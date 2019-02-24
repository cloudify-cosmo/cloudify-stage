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
        const textHeight = 18;
        let currentTextPlacement_Y = -2;
        let rectClassName = 'rect-tasks-graph-general';
        let title = this.props.graphNode.labels && this.props.graphNode.labels[0].display_title ? this.props.graphNode.labels[0].display_title : this.props.graphNode.labels[0].text;
        if (typeof title === 'string') {
            title = [title];
        }
        let display_text = this.props.graphNode.labels && this.props.graphNode.labels[0].display_text ? this.props.graphNode.labels[0].display_text : null;
        let state = null;
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
                {
                    title !== null && title.map((line) => (
                        <text
                            key={currentTextPlacement_Y}
                            className='text-tasks-graph-subgraph-title'
                            transform={
                                this.props.graphNode.children && this.props.graphNode.children.length === 0 ? // Placing text according to subgraph tier
                                `translate(10, ${currentTextPlacement_Y += textHeight})` :
                                'translate(0, -5)'
                            }
                        >
                            {line}
                        </text>
                    ))
                }
                {
                    display_text !== null && display_text.map((line) => (
                        <text
                            key={currentTextPlacement_Y}
                            className='text-tasks-graph-operation-and-state'
                            transform={
                                `translate(10, ${currentTextPlacement_Y += textHeight})`
                            }
                        >
                            {line}
                        </text>
                    ))
                }
            </g>
        )
    }
}