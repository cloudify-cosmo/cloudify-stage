import * as DCommon from './common';
import { sharedConfiguration, sharedDefinition } from './configuration';
import { DeploymentsView as DDeploymentsView } from './DeploymentsView';
import './styles.scss';
import { DeploymentStatus } from './types';

export default {
    sharedDefinition,
    Common: DCommon,
    Configuration: { sharedConfiguration },
    DeploymentsView: DDeploymentsView,
    Types: { DeploymentStatus }
};
