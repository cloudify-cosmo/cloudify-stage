/**
 * Created by pposel on 16/02/2017.
 */
import MaintenanceMode from '../../components/maintenance/MaintenanceMode';
import { connect } from 'react-redux';
import {switchMaintenance, getActiveExecutions, setActiveExecutions, doCancelExecution} from '../../actions/managers';

const mapStateToProps = (state, ownProps) => {
    return {
        manager: state.manager,
        show: ownProps.show,
        onHide: ownProps.onHide,
        activeExecutions: state.manager.activeExecutions
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onMaintenanceActivate: (manager) => {
            return dispatch(switchMaintenance(manager, true));
        },
        onMaintenanceDeactivate: (manager) => {
            return dispatch(switchMaintenance(manager, false));
        },
        onFetchActiveExecutions: (manager) => {
            return dispatch(getActiveExecutions(manager));
        },
        onCancelExecution: (manager,execution, action) => {
            return dispatch(doCancelExecution(manager, execution, action));
        },
        onClose: () => {
            return dispatch(setActiveExecutions({}));
        }
    }
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return Object.assign({}, stateProps, ownProps, dispatchProps, {
        onMaintenanceActivate: ()=>dispatchProps.onMaintenanceActivate(stateProps.manager),
        onMaintenanceDeactivate: ()=>dispatchProps.onMaintenanceDeactivate(stateProps.manager),
        onFetchActiveExecutions: ()=>dispatchProps.onFetchActiveExecutions(stateProps.manager),
        onCancelExecution: (execution, action)=>dispatchProps.onCancelExecution(stateProps.manager,execution, action)
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(MaintenanceMode);