const DeploymentStatePropType = PropTypes.arrayOf(PropTypes.string);

export default PropTypes.shape({
    pending: DeploymentStatePropType.isRequired,
    inProgress: DeploymentStatePropType.isRequired,
    good: DeploymentStatePropType.isRequired,
    failed: DeploymentStatePropType.isRequired
});
