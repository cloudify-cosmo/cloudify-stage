/**
 * Created by pposel on 16/02/2017.
 */
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import MaintenanceModePageMessage from '../../components/maintenance/MaintenanceModePageMessage';
import stageUtils from '../../utils/stageUtils';
import Consts from '../../utils/consts';
import { getClusterStatus } from '../../actions/clusterStatus';

const mapStateToProps = state => {
    const canMaintenanceMode = stageUtils.isUserAuthorized(Consts.permissions.STAGE_MAINTENANCE_MODE, state.manager);
    const showServicesStatus = stageUtils.isUserAuthorized(Consts.permissions.STAGE_SERVICES_STATUS, state.manager);
    return {
        canMaintenanceMode,
        isFetchingClusterStatus: _.get(state.manager, 'clusterStatus.isFetching'),
        maintenanceStatus: _.get(state.manager, 'maintenance'),
        showServicesStatus
    };
};
const mapDispatchToProps = dispatch => {
    return {
        navigateToHome: () => {
            return dispatch(push(Consts.HOME_PAGE_PATH));
        },
        onGetClusterStatus: () => {
            dispatch(getClusterStatus());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MaintenanceModePageMessage);
