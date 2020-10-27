export default PropTypes.shape({
    groups: PropTypes.arrayOf(PropTypes.string),
    tenant_roles: PropTypes.shape({ direct: PropTypes.shape({}), groups: PropTypes.shape({}) }),
    tenants: PropTypes.shape({}),
    username: PropTypes.string
});
