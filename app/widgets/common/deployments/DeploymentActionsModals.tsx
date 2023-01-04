import type { FunctionComponent } from 'react';
import React from 'react';
import DeployBlueprintModal from '../deployModal/DeployBlueprintModal';
import ExecuteWorkflowModal from '../executeWorkflow/ExecuteWorkflowModal';
import ManageLabelsModal from '../labels/ManageLabelsModal';
import { actions } from './DeploymentActionsMenu.consts';
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
    const deploymentToDeployOn = {
        id: deploymentId,
        displayName: deploymentName
    };

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
        case actions.deployOn:
            return (
                <DeployBlueprintModal
                    i18nHeaderKey="widgets.deploymentActionButtons.modals.deployOn.header"
                    deploymentToDeployOn={deploymentToDeployOn}
                    generateDeploymentIdOnMount
                    {...commonProps}
                />
            );
        case actions.setSite:
            return <SetSiteModal {...commonProps} />;
        default:
            return null;
    }
};

export default DeploymentActionsModals;
