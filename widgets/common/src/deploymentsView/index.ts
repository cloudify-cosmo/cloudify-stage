import * as Table from './table';
import * as DCommon from './common';
import DetailsPane from './detailsPane';
import type { Deployment, DeploymentsResponse } from './types';
import { SharedDeploymentsViewWidgetConfiguration, sharedConfiguration, sharedDefinition } from './configuration';
import './styles.scss';

declare global {
    namespace Stage.Common.DeploymentsView {
        // NOTE: necessary rename to DCommon, since `Common` resolves to `Stage.Common`, not the `Common` import
        export { Table, DCommon as Common, DetailsPane, sharedDefinition };

        // NOTE: no-namespace rule does not detect that `export namespace` are in a `declare` context
        /* eslint-disable @typescript-eslint/no-namespace */
        export namespace Configuration {
            export { SharedDeploymentsViewWidgetConfiguration, sharedConfiguration };
        }
        export namespace Types {
            export { Deployment, DeploymentsResponse };
        }
    }
}

Stage.defineCommon({
    name: 'DeploymentsView',
    common: {
        sharedDefinition,
        DetailsPane,
        Common: DCommon,
        Table,
        Configuration: { sharedConfiguration },
        Types: {}
    }
});
