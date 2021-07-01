/* eslint-disable react/jsx-props-no-spreading */
import type { FunctionComponent } from 'react';
import { actions } from './DeploymentActionsMenu';

interface DeploymentActionsModalsProps {
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
    const {
        Common: {
            // @ts-expect-error Not migrated to TS yet
            ExecuteDeploymentModal,
            // @ts-expect-error Not migrated to TS yet
            UpdateDeploymentModal,
            RemoveDeploymentModal,
            // @ts-expect-error Not migrated to TS yet
            SetSiteModal,
            Labels: { ManageModal: ManageLabelsModal }
        }
        // NOTE: `as any` since the commons are not migrated to TS yet
    } = Stage;

    const commonProps = { deploymentId, deploymentName, open: true, onHide, toolbox };

    switch (activeAction) {
        case actions.manageLabels:
            return <ManageLabelsModal {...commonProps} />;
        case actions.install:
        case actions.uninstall:
            return <ExecuteDeploymentModal {...commonProps} workflow={activeAction} />;
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

declare global {
    namespace Stage.Common {
        // eslint-disable-next-line import/prefer-default-export
        export { DeploymentActionsModals };
    }
}

Stage.defineCommon({
    name: 'DeploymentActionsModals',
    common: DeploymentActionsModals
});
