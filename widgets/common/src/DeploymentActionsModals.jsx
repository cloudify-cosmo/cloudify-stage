/* eslint-disable react/jsx-props-no-spreading */
import { actions } from './DeploymentActionsMenu';

export default function DeploymentActionsModals({ activeAction, deploymentId, onHide, toolbox }) {
    const {
        Common: {
            ExecuteDeploymentModal,
            ManageLabelsModal,
            UpdateDeploymentModal,
            RemoveDeploymentModal,
            SetSiteModal
        }
    } = Stage;

    const commonProps = { deploymentId, open: true, onHide, toolbox };

    let workflowName = '';
    if (activeAction === actions.install) {
        workflowName = 'install';
    } else if (activeAction === actions.uninstall) {
        workflowName = 'uninstall';
    }

    switch (activeAction) {
        case actions.manageLabels:
            return <ManageLabelsModal {...commonProps} />;
        case actions.install:
        case actions.uninstall:
            return <ExecuteDeploymentModal {...commonProps} workflow={workflowName} />;
        case actions.update:
            return <UpdateDeploymentModal {...commonProps} />;
        case actions.delete:
        case actions.forceDelete:
            return <RemoveDeploymentModal {...commonProps} force={activeAction === actions.forceDelete} />;
        case actions.setSite:
            return <SetSiteModal {...commonProps} />;
        default:
            return null;
    }
}

DeploymentActionsModals.propTypes = {
    activeAction: PropTypes.string.isRequired,
    deploymentId: PropTypes.string.isRequired,
    onHide: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

Stage.defineCommon({
    name: 'DeploymentActionsModals',
    common: DeploymentActionsModals
});
