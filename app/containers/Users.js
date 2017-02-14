/**
 * Created by jakubniezgoda on 07/02/2017.
 */

import { connect } from 'react-redux'
import Users from '../components/Users'
import { logout } from '../actions/managers';
import { setEditMode } from '../actions/config';
import { minimizeWidgets } from '../actions/widgets';

const mapStateToProps = (state, ownProps) => {
    return {
        isEditMode: state.config.isEditMode || false,
        manager: ownProps.manager
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
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Users);
