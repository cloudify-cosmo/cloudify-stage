/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import _ from 'lodash';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Users from '../components/Users';
import { logout } from '../actions/managers';
import { setEditMode } from '../actions/config';
import { minimizeWidgets } from '../actions/widgets';
import Consts from '../utils/consts';
import stageUtils from '../utils/stageUtils';

const mapStateToProps = state => {
    const isTemplateManagementActive = state.templateManagement.isActive;

    const canChangePassword = !state.manager.isLdap;

    const canEditMode =
        !isTemplateManagementActive && stageUtils.isUserAuthorized(Consts.permissions.STAGE_EDIT_MODE, state.manager);
    const canTemplateManagement =
        state.config.mode === Consts.MODE_MAIN &&
        stageUtils.isUserAuthorized(Consts.permissions.STAGE_TEMPLATE_MANAGEMENT, state.manager);
    const canLicenseManagement =
        state.config.mode === Consts.MODE_MAIN &&
        stageUtils.isUserAuthorized(Consts.permissions.LICENSE_UPLOAD, state.manager) &&
        _.get(state, 'manager.license.isRequired', false);

    return {
        isEditMode: canEditMode ? state.config.isEditMode || false : false,
        canChangePassword,
        canEditMode,
        canTemplateManagement,
        canLicenseManagement
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onEditModeChange: isEditMode => {
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
