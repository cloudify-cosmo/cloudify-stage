/**
 * Created by barucoh on 23/1/2019.
 */
/**
 * @property {Any} [graphEdge] - A Graph Edge to render
 */

const GraphEdge = props => {
    const edge = props.graphEdge;
    const { startPoint } = edge.sections[0];
    const { bendPoints } = edge.sections[0];
    const { endPoint } = edge.sections[0];

    // Used to visually draw the arrow better
    const svgArrowVisualAdjustment = -0.9;
    // Used to draw an arrow shape
    const svgArrow_X = -5;
    const svgArrowBot_Y = 5;
    const svgArrowTop_Y = -5;

    const drawingPath = {
        x: 0,
        y: 0
    };
    if (!bendPoints) {
        // No Bend Points
        // Start point to end point
        drawingPath.x = endPoint.x - startPoint.x;
        drawingPath.y = endPoint.y - startPoint.y;
        return (
            <g className="g-tasks-graph-general g-tasks-graph-edge">
                <path
                    key={`${startPoint.x + startPoint.y + drawingPath.x + drawingPath.y}`}
                    d={`m${startPoint.x} ${startPoint.y} l${drawingPath.x} ${drawingPath.y}`}
                />
                <path
                    key={`${endPoint.x +
                        svgArrowVisualAdjustment +
                        endPoint.y +
                        svgArrowBot_Y +
                        svgArrow_X +
                        svgArrowBot_Y}`}
                    d={`m${endPoint.x + svgArrowVisualAdjustment} ${endPoint.y} l${svgArrow_X} ${svgArrowBot_Y}`}
                />
                <path
                    key={`${endPoint.x +
                        svgArrowVisualAdjustment +
                        endPoint.y +
                        svgArrowTop_Y +
                        svgArrow_X +
                        svgArrowTop_Y}`}
                    d={`m${endPoint.x + svgArrowVisualAdjustment} ${endPoint.y} l${svgArrow_X} ${svgArrowTop_Y}`}
                />
            </g>
        );
    }
    // At least 1 Bend Point exists
    // Start point to first bend point - Bend point to bend point - Bend point to end point
    const lastBendPoint = { ...bendPoints[bendPoints.length - 1] };
    const lastDrawingPath = { ...drawingPath };
    drawingPath.x = bendPoints[0].x - startPoint.x;
    drawingPath.y = bendPoints[0].y - startPoint.y;
    lastDrawingPath.x = endPoint.x - lastBendPoint.x;
    lastDrawingPath.y = endPoint.y - lastBendPoint.y;
    return (
        <g className="g-tasks-graph-general g-tasks-graph-edge">
            <path
                key={`${startPoint.x + startPoint.y + drawingPath.x + drawingPath.y}`}
                d={`m${startPoint.x} ${startPoint.y} l${drawingPath.x} ${drawingPath.y}`}
            />
            {bendPoints.map((bendPoint, index) => {
                // Already covered first index - Will draw nothing in the first iteration
                if (index !== 0) {
                    const prevBendPoint = { ...bendPoints[index - 1] };
                    drawingPath.x = bendPoint.x - prevBendPoint.x;
                    drawingPath.y = bendPoint.y - prevBendPoint.y;
                    return (
                        <path
                            key={`${bendPoint.x + bendPoint.y + drawingPath.x + drawingPath.y}`}
                            d={`m${prevBendPoint.x} ${prevBendPoint.y} l${drawingPath.x} ${drawingPath.y}`}
                        />
                    );
                }
            })}
            <path
                key={`${endPoint.x + endPoint.y + drawingPath.x + drawingPath.y}`}
                d={`m${lastBendPoint.x} ${lastBendPoint.y} l${lastDrawingPath.x} ${lastDrawingPath.y}`}
            />
            <path
                key={`${endPoint.x +
                    svgArrowVisualAdjustment +
                    endPoint.y +
                    svgArrowBot_Y +
                    svgArrow_X +
                    svgArrowBot_Y}`}
                d={`m${endPoint.x + svgArrowVisualAdjustment} ${endPoint.y} l${svgArrow_X} ${svgArrowBot_Y}`}
            />
            <path
                key={`${endPoint.x +
                    svgArrowVisualAdjustment +
                    endPoint.y +
                    svgArrowTop_Y +
                    svgArrow_X +
                    svgArrowTop_Y}`}
                d={`m${endPoint.x + svgArrowVisualAdjustment} ${endPoint.y} l${svgArrow_X} ${svgArrowTop_Y}`}
            />
        </g>
    );
};

const pointPropType = PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
});

GraphEdge.propTypes = {
    graphEdge: PropTypes.shape({
        sections: PropTypes.arrayOf(
            PropTypes.shape({
                startPoint: pointPropType.isRequired,
                bendPoints: PropTypes.arrayOf(pointPropType),
                endPoint: pointPropType.isRequired
            })
        ).isRequired
    }).isRequired
};

export default GraphEdge;
