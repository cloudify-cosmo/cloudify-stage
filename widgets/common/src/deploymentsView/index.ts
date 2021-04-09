import * as Table from './table';
import * as Common from './common';
import * as Types from './types';
import DetailsPane from './detailsPane';
import './styles.scss';

const DeploymentsView = {
    Table,
    Common,
    Types,
    DetailsPane
};

declare global {
    namespace Stage {
        // TODO: use namespace instead of interface for Common for more convenient imports of types
        interface Common {
            DeploymentsView: typeof DeploymentsView;
        }
    }
}

Stage.defineCommon({
    name: 'DeploymentsView',
    common: DeploymentsView
});
