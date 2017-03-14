/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import { connect } from 'react-redux'
import Users from '../components/Users'
import { logout } from '../actions/managers';
import { setEditMode } from '../actions/config';
import { minimizeWidgets } from '../actions/widgets';
import {resetTemplate} from '../actions/userApp';
import {setAppLoading} from '../actions/app';
import Consts from '../utils/consts';

const mapStateToProps = (state, ownProps) => {
    var canEditTheUi = state.manager.auth.role === Consts.ROLE_ADMIN ?
                            true :
                            state.config.clientConfig.canUserEdit || false;
    return {
        isEditMode: canEditTheUi ? (state.config.isEditMode || false) : false,
        canEditTheUi,
        config: state.config,
        templates: state.templates,
        widgetDefinitions: state.widgetDefinitions
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onConfigure: () => {
            /* TODO */
        },
        onEditModeChange: (isEditMode) => {
            if (isEditMode) {
                dispatch(minimizeWidgets());
            }
            dispatch(setEditMode(isEditMode));
        },
        onLogout: () => {
            dispatch(logout());
        },
        onResetTemplate: (manager,config,templates,widgetDefinitions) =>{
            dispatch(setAppLoading(true));
            dispatch(resetTemplate(manager,config,templates,widgetDefinitions));
            dispatch(setAppLoading(false));
        },
        onMaintenance: ownProps.onMaintenance,
        onConfigure: ownProps.onConfigure
    }
};

function mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({}, ownProps, dispatchProps,{
        onResetTemplate: ()=>dispatchProps.onResetTemplate(ownProps.manager,stateProps.config,stateProps.templates,stateProps.widgetDefinitions),
        isEditMode: stateProps.isEditMode,
        canEditTheUi: stateProps.canEditTheUi
    });
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Users);
