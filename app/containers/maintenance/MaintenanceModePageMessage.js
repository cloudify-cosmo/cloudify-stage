/**
 * Created by pposel on 16/02/2017.
 */
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import MaintenanceModePageMessage from '../../components/maintenance/MaintenanceModePageMessage';
import stageUtils from '../../utils/stageUtils';
import Consts from '../../utils/consts';

const mapStateToProps = (state, ownProps) => {
    const canMaintenanceMode = stageUtils.isUserAuthorized(Consts.permissions.STAGE_MAINTENANCE_MODE, state.manager);
    const showServicesStatus = stageUtils.isUserAuthorized(Consts.permissions.STAGE_SERVICES_STATUS, state.manager);
    return {
        manager: state.manager,
        canMaintenanceMode,
        showServicesStatus
    };
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        navigateToHome: () => {
            return dispatch(push(Consts.HOME_PAGE_PATH));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MaintenanceModePageMessage);
