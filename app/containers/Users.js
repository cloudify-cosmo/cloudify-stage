/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import { connect } from 'react-redux'
import Users from '../components/Users'
import { logout } from '../actions/managers';
import { setEditMode } from '../actions/config';
import { minimizeWidgets } from '../actions/widgets';
import Consts from '../utils/consts';
import stageUtils from '../utils/stageUtils';
import { push } from 'connected-react-router';

const mapStateToProps = (state, ownProps) => {
    var isTemplateManagementActive = !!state.templateManagement.templates || !!state.templateManagement.page;

    var canEditMode = !isTemplateManagementActive && stageUtils.isUserAuthorized(Consts.permissions.STAGE_EDIT_MODE, state.manager);
    var canConfigure = stageUtils.isUserAuthorized(Consts.permissions.STAGE_CONFIGURE, state.manager);
    var canTemplateManagement = state.config.mode === Consts.MODE_MAIN && stageUtils.isUserAuthorized(Consts.permissions.STAGE_TEMPLATE_MANAGEMENT, state.manager);

    return {
        isEditMode: canEditMode ? (state.config.isEditMode || false) : false,
        isLicenseRequired: _.get(state, 'manager.license.isRequired', false),
        canEditMode,
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
            dispatch(push('/template_management'));
        },
        onLicense: () => {
            dispatch(push(Consts.LICENSE_PAGE_PATH));
        },
        onReset: ownProps.onReset
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Users);
