export default PropTypes.shape({
    id: PropTypes.string,
    isSelected: PropTypes.bool,
    node_id: PropTypes.string,
    relationships: PropTypes.arrayOf(PropTypes.shape({})),
    runtime_properties: PropTypes.shape({}),
    state: PropTypes.string
});
