// NOTE: names prefixed with D so they can be exported inside namespace with a different name
import * as DTable from './table';
import * as DCommon from './common';
import DDetailsPane from './detailsPane';
import type { Deployment, DeploymentsResponse, SharedDeploymentsViewWidgetConfiguration } from './types';
import './styles.scss';

declare global {
    namespace Stage.Common.DeploymentsView {
        const Table: typeof DTable;
        const Common: typeof DCommon;
        const DetailsPane: typeof DDetailsPane;
        namespace Types {
            export { Deployment, DeploymentsResponse, SharedDeploymentsViewWidgetConfiguration };
        }
    }
}

Stage.defineCommon({
    name: 'DeploymentsView',
    common: {
        DetailsPane: DDetailsPane,
        Common: DCommon,
        Table: DTable,
        Types: {}
    }
});
