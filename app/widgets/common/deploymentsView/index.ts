import * as DCommon from './common';
import { getSharedConfiguration, sharedDefinition } from './configuration';
import { DeploymentsView as DDeploymentsView } from './DeploymentsView';
import './styles.scss';
import { DeploymentStatus } from './types';

export default {
    sharedDefinition,
    Common: DCommon,
    Configuration: { getSharedConfiguration },
    DeploymentsView: DDeploymentsView,
    Types: { DeploymentStatus }
};
