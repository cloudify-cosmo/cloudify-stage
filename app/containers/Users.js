/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import { connect } from 'react-redux'
import Users from '../components/Users'
import { logout } from '../actions/managers';
import { setEditMode } from '../actions/config';
import { minimizeWidgets } from '../actions/widgets';
import Consts from '../utils/consts';
import { push } from 'react-router-redux';

const mapStateToProps = (state, ownProps) => {
    var canEditTheUi = state.manager.auth.role === Consts.ROLE_ADMIN ?
                            true :
                            state.config.clientConfig.canUserEdit || false;
    return {
        isEditMode: canEditTheUi ? (state.config.isEditMode || false) : false,
        canEditTheUi
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
