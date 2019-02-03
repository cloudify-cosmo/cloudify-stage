

export default class GraphEdge extends React.Component {
    /**
     * @property {Any} [graphEdge] - A Graph Edge to render
     */
    /*static propTypes = {
        graphEdge: PropTypes.any.isRequired
    };*/
    constructor(props, context) {
        super(props, context);
        this.state = {
            graphEdge: props.graphEdge
        };
    }
    render() {
        let edge = this.state.graphEdge;
        let startPoint = edge.sections[0].startPoint;
        let bendPoints = edge.sections[0].bendPoints;
        let endPoint = edge.sections[0].endPoint;
        let drawingPath = {
            x: 0,
            y: 0
        }
        if (!bendPoints) {
            // No Bend Points
            // Start point to end point
            drawingPath.x = endPoint.x - startPoint.x
            drawingPath.y = endPoint.y - startPoint.y
            return (
                <g fill='none' stroke='black' strokeWidth='2'>                                            
                    <path
                        key={`${startPoint.x + startPoint.y}`}
                        d={`m${startPoint.x} ${startPoint.y} l${drawingPath.x} ${drawingPath.y}`}
                    />
                    <path
                        key={`${endPoint.x-0.9 + endPoint.y+5}`}
                        d={`m${endPoint.x-0.9} ${endPoint.y} l-5 5`}
                    />
                    <path
                        key={`${endPoint.x-0.9 + endPoint.y-5}`}
                        d={`m${endPoint.x-0.9} ${endPoint.y} l-5 -5`}
                    />
                </g>
            )
        } else {
            // At least 1 Bend Point exists
            // Start point to first bend point - Bend point to bend point - Bend point to end point
            let lastBendPoint = {...bendPoints[bendPoints.length - 1]}
            let lastDrawingPath = {...drawingPath}
            drawingPath.x = bendPoints[0].x - startPoint.x
            drawingPath.y = bendPoints[0].y - startPoint.y
            lastDrawingPath.x = endPoint.x - lastBendPoint.x
            lastDrawingPath.y = endPoint.y - lastBendPoint.y
            return (
                <g fill='none' stroke='black' strokeWidth='2'>
                    <path
                        key={`${startPoint.x + startPoint.y}`}
                        d={`m${startPoint.x} ${startPoint.y} l${drawingPath.x} ${drawingPath.y}`}
                    />
                    {
                        bendPoints.map((bendPoint, index) => {
                            // Already covered first index - Will draw nothing in the first iteration
                            if(index !== 0)
                            {
                                let prevBendPoint = {...bendPoints[index - 1]}
                                drawingPath.x = bendPoint.x - prevBendPoint.x
                                drawingPath.y = bendPoint.y - prevBendPoint.y
                                return (
                                    <path
                                        key={`${bendPoint.x + bendPoint.y}`}
                                        d={`m${prevBendPoint.x} ${prevBendPoint.y} l${drawingPath.x} ${drawingPath.y}`}
                                    />
                                )
                            }
                        })
                    }
                    <path
                        key={`${endPoint.x + endPoint.y}`}
                        d={`m${lastBendPoint.x} ${lastBendPoint.y} l${lastDrawingPath.x} ${lastDrawingPath.y}`}
                    />
                    <path
                        key={`${endPoint.x-0.9 + endPoint.y+5}`}
                        d={`m${endPoint.x-0.9} ${endPoint.y} l-5 5`}
                    />
                    <path
                        key={`${endPoint.x-0.9 + endPoint.y-5}`}
                        d={`m${endPoint.x-0.9} ${endPoint.y} l-5 -5`}
                    />
                </g>
            )
        }
    }
}