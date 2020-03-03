/**
 * Created by barucoh on 23/1/2019.
 */
/**
 * @property {Any} [graphNode] - A Graph Node to render
 */

const GraphNode = props => {
    const textHeight = 18;
    const rx = 3;
    let currentTextPlacement_Y = 0;
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
            <rect
                height={props.graphNode.height}
                width={props.graphNode.width}
                className={rectClassName}
                rx={rx}
                fillOpacity={0.5}
                strokeOpacity={0.7}
            />
            <rect
                transform="translate(0.5, 0.5)"
                height={textHeight}
                width={props.graphNode.width - 1}
                className={rectClassName}
                rx={rx - 0.5}
                strokeWidth={0}
            />
            <rect
                transform={`translate(0.5, ${textHeight / 2})`}
                height={_.size(title) * textHeight}
                width={props.graphNode.width - 1}
                className={rectClassName}
                strokeWidth={0}
            />
            <path
                d={`m 0,${_.size(title) * textHeight + textHeight / 2} h ${props.graphNode.width} z`}
                strokeWidth={0.5}
                strokeOpacity={0.7}
            />
            {title !== null &&
                title.map(line => (
                    <text
                        key={currentTextPlacement_Y}
                        className="text-tasks-graph-subgraph-title"
                        transform={
                            props.graphNode.children && props.graphNode.children.length === 0 // Placing text according to subgraph tier
                                ? `translate(10, ${(currentTextPlacement_Y += textHeight)})`
                                : 'translate(12, 18)'
                        }
                    >
                        {line}
                    </text>
                ))}
            >
            {display_text !== null &&
                display_text.map(line => (
                    <text
                        key={currentTextPlacement_Y}
                        className="text-tasks-graph-operation-and-state"
                        transform={`translate(10, ${(currentTextPlacement_Y += textHeight) + 7})`}
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
