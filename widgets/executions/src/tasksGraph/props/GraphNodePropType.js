import GraphEdgePropType from './GraphEdgePropType';

const graphNodeShape = {
    labels: PropTypes.arrayOf(
        PropTypes.shape({
            displayText: Stage.PropTypes.StringOrArray,
            displayTitle: PropTypes.arrayOf(PropTypes.string),
            text: Stage.PropTypes.StringOrArray,
            state: PropTypes.string,
            retry: PropTypes.number
        })
    ),
    height: PropTypes.number,
    width: PropTypes.number,
    nodeInstanceId: PropTypes.string,
    operation: PropTypes.string,
    edges: PropTypes.arrayOf(GraphEdgePropType).isRequired // While required, may be empty
};
graphNodeShape.children = PropTypes.arrayOf(PropTypes.shape(graphNodeShape)).isRequired; // While required, may be empty

export default PropTypes.shape(graphNodeShape);
