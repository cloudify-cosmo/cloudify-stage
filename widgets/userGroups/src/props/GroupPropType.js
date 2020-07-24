export default PropTypes.shape({
    name: PropTypes.string,
    tenants: PropTypes.object,
    users: PropTypes.arrayOf(PropTypes.string)
});
