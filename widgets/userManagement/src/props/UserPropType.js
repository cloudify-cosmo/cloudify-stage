export default PropTypes.shape({
    groups: PropTypes.array,
    tenant_roles: PropTypes.shape({ direct: PropTypes.object, groups: PropTypes.object }),
    tenants: PropTypes.object,
    username: PropTypes.string
});
