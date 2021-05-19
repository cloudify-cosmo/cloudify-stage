import * as DCommon from './common';
import type { DeploymentsResponse } from './types';
import { SharedDeploymentsViewWidgetConfiguration, sharedConfiguration, sharedDefinition } from './configuration';
import './styles.scss';
import { DeploymentsView as DDeploymentsView } from './DeploymentsView';
import { DeploymentStatus } from './types';

declare global {
    namespace Stage.Common {
        // eslint-disable-next-line @typescript-eslint/no-namespace
        namespace DeploymentsView {
            // NOTE: necessary rename to DCommon, since `Common` resolves to `Stage.Common`, not the `Common` import
            export { DCommon as Common, sharedDefinition, DDeploymentsView as DeploymentsView };

            // NOTE: no-namespace rule does not detect that `export namespace` are in a `declare` context
            /* eslint-disable @typescript-eslint/no-namespace */
            export namespace Configuration {
                export { SharedDeploymentsViewWidgetConfiguration, sharedConfiguration };
            }
            export namespace Types {
                export { DeploymentsResponse, DeploymentStatus };
            }
        }
    }
}

Stage.defineCommon({
    name: 'DeploymentsView',
    common: {
        sharedDefinition,
        Common: DCommon,
        Configuration: { sharedConfiguration },
        DeploymentsView: DDeploymentsView,
        Types: { DeploymentStatus }
    }
});
