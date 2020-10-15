const pointPropType = PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
});

export default PropTypes.shape({
    id: PropTypes.String,
    sources: PropTypes.arrayOf(PropTypes.string),
    targets: PropTypes.arrayOf(PropTypes.string),
    sections: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            startPoint: pointPropType.isRequired,
            bendPoints: PropTypes.arrayOf(pointPropType),
            endPoint: pointPropType.isRequired
        })
    )
});
