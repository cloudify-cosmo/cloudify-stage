/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import { connect } from 'react-redux'
import Users from '../components/Users'
import { logout } from '../actions/managers';
import { setEditMode } from '../actions/config';
import { minimizeWidgets } from '../actions/widgets';
import Consts from '../utils/consts';
import Auth from '../utils/auth';
import { push } from 'react-router-redux';

const mapStateToProps = (state, ownProps) => {

    var canEditMode = Auth.isUserAuthorized(Consts.permissions.STAGE_EDIT_MODE, state.manager);
    var canMaintenanceMode = Auth.isUserAuthorized(Consts.permissions.STAGE_MAINTENANCE_MODE, state.manager);
    var canConfigure = Auth.isUserAuthorized(Consts.permissions.STAGE_CONFIGURE, state.manager);
    var canTemplateManagement = Auth.isUserAuthorized(Consts.permissions.STAGE_TEMPLATE_MANAGEMENT, state.manager);
    return {
        isEditMode: canEditMode ? (state.config.isEditMode || false) : false,
        canEditMode,
        canMaintenanceMode,
        canConfigure,
        canTemplateManagement
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onEditModeChange: (isEditMode) => {
            if (isEditMode) {
                dispatch(minimizeWidgets());
            }
            dispatch(setEditMode(isEditMode));
        },
        onLogout: () => {
            dispatch(logout());
        },
        onTemplates: () => {
            dispatch(push('template_management'));
        },
        onReset: ownProps.onReset,
        onMaintenance: ownProps.onMaintenance,
        onConfigure: ownProps.onConfigure
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Users);
