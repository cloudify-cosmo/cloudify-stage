import Actions from './actions';
import BlueprintMarketplace from './blueprintMarketplace';
import Blueprints from './blueprints';
import Components from './components';
import Deployments from './deployments';
import DeploymentsView from './deploymentsView';
import DeployBlueprintModal from './deployModal/DeployBlueprintModal';
import Workflows from './executeWorkflow';
import Executions from './executions';
import Filters from './filters';
import Inputs from './inputs';
import Labels from './labels';
import Map from './map';
import NodeInstancesConsts from './nodes/NodeInstancesConsts';
import Plugins from './plugins';
import Roles from './roles';
import SecretActions from './secrets/SecretActions';
import TerraformModal from './terraformModal';
import EventUtils from './utils/EventUtils';
import Consts from './Consts';

const StageCommon = {
    Actions,
    BlueprintMarketplace,
    Blueprints,
    Components,
    Deployments,
    DeploymentsView,
    DeployBlueprintModal,
    Workflows,
    Executions,
    Filters,
    Inputs,
    Labels,
    Map,
    NodeInstancesConsts,
    Plugins,
    Roles,
    SecretActions,
    TerraformModal,
    EventUtils,
    Consts
};

declare global {
    namespace Stage {
        const Common: typeof StageCommon;
    }
}

Stage.defineCommon(StageCommon);
