import Actions from './DeploymentActions';
import ActionsMenu from './DeploymentActionsMenu';
import ActionsModals from './DeploymentActionsModals';
import Details from './DeploymentDetails';
import UpdateDetailsModal from './UpdateDetailsModal';

const DeploymentsCommon = {
    Actions,
    ActionsMenu,
    ActionsModals,
    Details,
    UpdateDetailsModal
};

declare global {
    namespace Stage.Common {
        const Deployments: typeof DeploymentsCommon;
    }
}

Stage.defineCommon({
    name: 'Deployments',
    common: DeploymentsCommon
});
