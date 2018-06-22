/**
 * Created by pposel on 16/02/2017.
 */
import MaintenanceModePageMessage from '../../components/maintenance/MaintenanceModePageMessage';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import stageUtils from '../../utils/stageUtils';
import Consts from '../../utils/consts';

const mapStateToProps = (state, ownProps) => {
    let canMaintenanceMode = stageUtils.isUserAuthorized(Consts.permissions.STAGE_MAINTENANCE_MODE, state.manager);
    let showServicesStatus = stageUtils.isUserAuthorized(Consts.permissions.STAGE_SERVICES_STATUS, state.manager);
    return {
        manager: state.manager,
        canMaintenanceMode,
        showServicesStatus
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        navigateToHome: () => {
            return dispatch(push('/'));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MaintenanceModePageMessage);