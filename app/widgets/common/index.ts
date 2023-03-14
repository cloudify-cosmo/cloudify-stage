import Actions from './actions';
import Blueprints from './blueprints';
import Components from './components';
import Configuration from './configuration';
import Consts from './Consts';
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
import TerraformModal from './terraformModal';
import HelmModal from './helmModal';
import Secrets from './secrets';
import Tenants from './tenants';
import EventUtils from './utils/EventUtils';

const StageCommon = {
    Actions,
    Blueprints,
    Components,
    Configuration,
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
    Secrets,
    TerraformModal,
    HelmModal,
    Tenants,
    EventUtils,
    Consts
};

export default StageCommon;
