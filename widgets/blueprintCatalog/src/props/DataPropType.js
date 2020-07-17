export default PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape({})),
    source: PropTypes.string,
    total: PropTypes.number
});
