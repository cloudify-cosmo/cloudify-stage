/**
 * Created by barucoh on 23/1/2019.
 */
/**
 * @property {Any} [graphNode] - A Graph Node to render
 */

const GraphNode = props => {
    const textHeight = 18;
    let currentTextPlacement_Y = -2;
    let rectClassName = 'rect-tasks-graph-general';
    let title =
        props.graphNode.labels && props.graphNode.labels[0].display_title
            ? props.graphNode.labels[0].display_title
            : props.graphNode.labels[0].text;
    if (typeof title === 'string') {
        title = [title];
    }
    const display_text =
        props.graphNode.labels && props.graphNode.labels[0].display_text
            ? props.graphNode.labels[0].display_text
            : null;
    let state = null;
    if (props.graphNode.labels && props.graphNode.labels[0].state) {
        state = props.graphNode.labels[0].state;
        switch (state) {
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
        <g className="g-tasks-graph-general">
            <rect height={props.graphNode.height} width={props.graphNode.width} className={rectClassName} />
            {title !== null &&
                title.map(line => (
                    <text
                        key={currentTextPlacement_Y}
                        className="text-tasks-graph-subgraph-title"
                        transform={
                            props.graphNode.children && props.graphNode.children.length === 0 // Placing text according to subgraph tier
                                ? `translate(10, ${(currentTextPlacement_Y += textHeight)})`
                                : 'translate(0, -5)'
                        }
                    >
                        {line}
                    </text>
                ))}
            {display_text !== null &&
                display_text.map(line => (
                    <text
                        key={currentTextPlacement_Y}
                        className="text-tasks-graph-operation-and-state"
                        transform={`translate(10, ${(currentTextPlacement_Y += textHeight)})`}
                    >
                        {line}
                    </text>
                ))}
        </g>
    );
};

GraphNode.propTypes = {
    graphNode: PropTypes.shape({
        labels: PropTypes.arrayOf(
            PropTypes.shape({
                displayTitle: PropTypes.arrayOf(PropTypes.string),
                text: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
                state: PropTypes.string
            })
        ),
        height: PropTypes.number,
        width: PropTypes.number,
        children: PropTypes.array
    }).isRequired
};

export default GraphNode;
