export default PropTypes.shape({
    name: PropTypes.string,
    tenants: PropTypes.shape({}),
    users: PropTypes.arrayOf(PropTypes.string)
});
