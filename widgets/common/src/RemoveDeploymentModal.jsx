function RemoveDeploymentModal({ open, deploymentId, force, onHide, toolbox }) {
    const {
        Basic: { Confirm, ErrorMessage },
        Common: { DeploymentActions },
        Hooks: { useErrors, useOpenProp },
        i18n
    } = Stage;

    const { errors, setErrors, clearErrors } = useErrors(null);

    useOpenProp(open, clearErrors);

    const content = i18n
        .t(`widgets.common.deployments.removeModal.${force ? 'forceDelete' : 'delete'}Description`, { deploymentId })
        .split('\n')
        // eslint-disable-next-line react/no-array-index-key
        .map((line, index) => <p key={index}>{line}</p>);

    function deleteDeployment() {
        const actions = new DeploymentActions(toolbox);
        const deleteAction = force ? 'doForceDelete' : 'doDelete';

        clearErrors();
        actions[deleteAction]({ id: deploymentId })
            .then(() => {
                toolbox.getEventBus().trigger('deployments:refresh');
                onHide();
            })
            .catch(error => {
                log.error(error);
                setErrors(error.message);
            });
    }

    return (
        <Confirm
            content={
                <div className="content">
                    <ErrorMessage autoHide error={errors} onDismiss={clearErrors} />
                    {content}
                </div>
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
