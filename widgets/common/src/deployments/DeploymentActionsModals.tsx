import type { FunctionComponent } from 'react';
import ExecuteWorkflowModal from '../executeWorkflow/ExecuteWorkflowModal';
import ManageLabelsModal from '../labels/ManageLabelsModal';
import { actions } from './DeploymentActionsMenu';
import RemoveDeploymentModal from './RemoveDeploymentModal';
import SetSiteModal from './SetSiteModal';
import UpdateDeploymentModal from './UpdateDeploymentModal';

export interface DeploymentActionsModalsProps {
    activeAction: string;
    deploymentId: string;
    deploymentName: string;
    onHide: () => void;
    toolbox: Stage.Types.Toolbox;
    redirectToParentPageAfterDelete: boolean;
}

const DeploymentActionsModals: FunctionComponent<DeploymentActionsModalsProps> = ({
    activeAction,
    deploymentId,
    deploymentName,
    onHide,
    toolbox,
    redirectToParentPageAfterDelete
}) => {
    const commonProps = { deploymentId, deploymentName, open: true, onHide, toolbox };

    switch (activeAction) {
        case actions.manageLabels:
            return <ManageLabelsModal {...commonProps} />;
        case actions.install:
        case actions.uninstall:
            return <ExecuteWorkflowModal {...commonProps} workflow={activeAction} />;
        case actions.update:
            return <UpdateDeploymentModal {...commonProps} />;
        case actions.delete:
        case actions.forceDelete:
            return (
                <RemoveDeploymentModal
                    {...commonProps}
                    force={activeAction === actions.forceDelete}
                    redirectToParentPageAfterDelete={redirectToParentPageAfterDelete}
                />
            );
        case actions.setSite:
            return <SetSiteModal {...commonProps} />;
        default:
            return null;
    }
};

DeploymentActionsModals.propTypes = {
    activeAction: PropTypes.string.isRequired,
    deploymentId: PropTypes.string.isRequired,
    onHide: PropTypes.func.isRequired,
    // NOTE: `as any` assertion since Toolbox from PropTypes and TS slightly differ
    toolbox: Stage.PropTypes.Toolbox.isRequired as any,
    redirectToParentPageAfterDelete: PropTypes.bool.isRequired
};

export default DeploymentActionsModals;
