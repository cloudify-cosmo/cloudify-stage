function RemoveDeploymentModal({ open, deploymentId, force, onHide, toolbox }) {
    const {
        Basic: { Confirm },
        Common: { DeploymentActions }
    } = Stage;

    function deleteDeployment() {
        const actions = new DeploymentActions(toolbox);
        const doDelete = force ? actions.doForceDelete : actions.doDelete;

        doDelete({ id: deploymentId })
            .then(() => {
                // TODO: Refresh
                // this.setError(null);
                // toolbox.getEventBus().trigger('deployments:refresh');
                // toolbox.loading(false);
            })
            .catch(err => {
                // TODO: Error handling
                // this.setError(err.message);
                // toolbox.loading(false);
            });
    }

    return (
        <Confirm
            content={
                force ? (
                    <div className="content">
                        <p>
                            {/* TODO: Use i18n. */}
                            Force delete will ignore any existing live nodes, or existing deployments which depend on
                            this deployment.
                        </p>
                        <p>
                            It&apos;s recommended to first run uninstall to stop the live nodes, and make sure there are
                            no running installations which depend on this deployment - and then run delete.
                        </p>
                        <p>Are you sure you want to ignore the live nodes and delete the deployment {deploymentId}?</p>
                    </div>
                ) : (
                    `Are you sure you want to remove deployment ${deploymentId}?`
                )
            }
            open={open}
            onConfirm={deleteDeployment}
            onCancel={onHide}
        />
    );
}

RemoveDeploymentModal.propTypes = {
    deploymentId: PropTypes.string.isRequired,
    force: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

Stage.defineCommon({
    name: 'RemoveDeploymentModal',
    common: RemoveDeploymentModal
});
