import type { FunctionComponent } from 'react';

interface RemoveDeploymentModalProps {
    open: boolean;
    deploymentId: string;
    force: boolean;
    onHide: () => void;
    toolbox: Stage.Types.Toolbox;
}

const RemoveDeploymentModal: FunctionComponent<RemoveDeploymentModalProps> = ({
    open,
    deploymentId,
    force,
    onHide,
    toolbox
}) => {
    const {
        Basic: { Confirm, ErrorMessage },
        Common: { DeploymentActions },
        Hooks: { useErrors, useOpenProp },
        i18n
    } = Stage;

    const { errors, setErrors, clearErrors } = useErrors();

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
                const contextDeploymentId = toolbox.getContext().getValue('deploymentId');
                if (deploymentId === contextDeploymentId) {
                    toolbox.getContext().setValue('deploymentId', null);
                    // TODO(RD-1824): do not go to parent page
                    toolbox.goToParentPage();
                }
                toolbox.getEventBus().trigger('deployments:refresh');
                onHide();
            })
            .catch((error: any) => {
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
};

RemoveDeploymentModal.propTypes = {
    deploymentId: PropTypes.string.isRequired,
    force: PropTypes.bool.isRequired,
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    // NOTE: `as any` assertion since Toolbox from PropTypes and TS slightly differ
    toolbox: Stage.PropTypes.Toolbox.isRequired as any
};

declare global {
    namespace Stage.Common {
        // eslint-disable-next-line import/prefer-default-export
        export { RemoveDeploymentModal };
    }
}

Stage.defineCommon({
    name: 'RemoveDeploymentModal',
    common: RemoveDeploymentModal
});
