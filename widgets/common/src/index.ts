import Actions from './actions';
import BlueprintMarketplace from './blueprintMarketplace';
import Blueprints from './blueprints';
import Components from './components';
import Consts from './Consts';
import Deployments from './deployments';
import DeploymentsView from './deploymentsView';
import DeployBlueprintModal from './deployModal/DeployBlueprintModal';
import Workflows from './executeWorkflow';
import Executions from './executions';
import Filters from './filters';
import StageHooks from './hooks';
import Inputs from './inputs';
import Labels from './labels';
import Map from './map';
import NodeInstancesConsts from './nodes/NodeInstancesConsts';
import Plugins from './plugins';
import StagePropTypes from './props';
import Roles from './roles';
import SecretActions from './secrets/SecretActions';
import TerraformModal from './terraformModal';
import tenants from './Tenants';
import EventUtils from './utils/EventUtils';

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
    tenants,
    EventUtils,
    Consts
};

type StagePropTypes = typeof StagePropTypes;
type StageHooks = typeof StageHooks;
type StageCommon = typeof StageCommon;

declare global {
    namespace Stage {
        /* eslint-disable @typescript-eslint/no-empty-interface */
        interface Common extends StageCommon {}
        interface PropTypes extends StagePropTypes {}
        interface Hooks extends StageHooks {}
        /* eslint-enable @typescript-eslint/no-empty-interface */
    }
}

Stage.defineCommon(StageCommon);
Stage.definePropTypes(StagePropTypes);
Stage.defineHooks(StageHooks);
