/**
 * Created by pposel on 16/02/2017.
 */
import MaintenanceMode from '../../components/maintenance/MaintenanceMode';
import { connect } from 'react-redux';
import {switchMaintenance, getActiveExecutions, setActiveExecutions, doCancelExecution} from "../../actions/managers";

const mapStateToProps = (state, ownProps) => {
    return {
        manager: ownProps.manager,
        show: ownProps.show,
        onHide: ownProps.onHide,
        activeExecutions: state.manager.activeExecutions
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onMaintenanceActivate: () => {
            return dispatch(switchMaintenance(ownProps.manager, true));
        },
        onMaintenanceDeactivate: () => {
            return dispatch(switchMaintenance(ownProps.manager, false));
        },
        onFetchActiveExecutions: () => {
            return dispatch(getActiveExecutions(ownProps.manager));
        },
        onCancelExecution: (execution, action) => {
            return dispatch(doCancelExecution(ownProps.manager, execution, action));
        },
        onClose: () => {
            return dispatch(setActiveExecutions({}));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MaintenanceMode);