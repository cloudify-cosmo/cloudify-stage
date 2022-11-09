import type { FunctionComponent } from 'react';
import ToolboxPropType from '../props/Toolbox';
import DeploymentActions from './DeploymentActions';

interface RemoveDeploymentModalProps {
    open: boolean;
    deploymentId: string;
    deploymentName: string;
    force: boolean;
    onHide: () => void;
    toolbox: Stage.Types.Toolbox;
    redirectToParentPageAfterDelete: boolean;
}

const RemoveDeploymentModal: FunctionComponent<RemoveDeploymentModalProps> = ({
    open,
    deploymentId,
    deploymentName,
    force,
    onHide,
    toolbox,
    redirectToParentPageAfterDelete
}) => {
    const {
        Basic: { Confirm, ErrorMessage },
        Hooks: { useErrors, useOpenProp },
        i18n
    } = Stage;

    const { errors, setErrors, clearErrors } = useErrors();

    useOpenProp(open, clearErrors);

    const content = Stage.Utils.renderMultilineText(
        i18n.t(`widgets.common.deployments.removeModal.${force ? 'forceDelete' : 'delete'}Description`, {
            deploymentName: Stage.Utils.formatDisplayName({ id: deploymentId, displayName: deploymentName })
        }),
        false
    );

    function deleteDeployment() {
        const actions = new DeploymentActions(toolbox.getManager());
        const deleteAction = force ? 'doForceDelete' : 'doDelete';

        clearErrors();
        actions[deleteAction]({ id: deploymentId })
            .then(() => {
                const contextDeploymentId = toolbox.getContext().getValue('deploymentId');
                if (deploymentId === contextDeploymentId) {
                    toolbox.getContext().setValue('deploymentId', null);

                    if (redirectToParentPageAfterDelete) {
                        toolbox.goToParentPage();
                    }
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
                // TODO(RD-2255): Once generic fix for long names is ready, the `style` prop should be removed
                <div className="content" style={{ wordBreak: 'break-word' }}>
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
    toolbox: ToolboxPropType.isRequired as any,
    redirectToParentPageAfterDelete: PropTypes.bool.isRequired
};

export default RemoveDeploymentModal;
