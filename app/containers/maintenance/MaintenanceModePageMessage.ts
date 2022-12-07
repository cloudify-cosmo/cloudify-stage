import _ from 'lodash';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import MaintenanceModePageMessage from '../../components/maintenance/MaintenanceModePageMessage';
import stageUtils from '../../utils/stageUtils';
import Consts from '../../utils/consts';
import { getClusterStatus } from '../../actions/manager/clusterStatus';
import type { ReduxState } from '../../reducers';
import type { ReduxThunkDispatch } from '../../configureStore';

const mapStateToProps = (state: ReduxState) => {
    const canMaintenanceMode = stageUtils.isUserAuthorized(Consts.permissions.STAGE_MAINTENANCE_MODE, state.manager);
    const showServicesStatus = stageUtils.isUserAuthorized(Consts.permissions.STAGE_SERVICES_STATUS, state.manager);
    return {
        canMaintenanceMode,
        isFetchingClusterStatus: _.get(state.manager, 'clusterStatus.isFetching'),
        maintenanceStatus: _.get(state.manager, 'maintenance'),
        showServicesStatus
    };
};
const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => {
    return {
        navigateToHome: () => {
            return dispatch(push(Consts.PAGE_PATH.HOME));
        },
        onGetClusterStatus: () => {
            dispatch(getClusterStatus());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MaintenanceModePageMessage);
