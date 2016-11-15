/**
 * Created by pawelposel on 03/11/2016.
 */

import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import Managers from '../components/Managers'
import {getStatus} from '../actions/managers';

const mapStateToProps = (state, ownProps) => {
    return {
        managers: ownProps.managers,
        selectedManager:_.find(ownProps.managers.items,{id:ownProps.managers.selected})
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onManagerConfig: () => {
            dispatch(push('/login'));
        },

        onManagerChange: () => {
            //TODO: handle multiple manager switching
        },

        fetchManagerStatus: (manager) => {
            dispatch(getStatus(manager));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Managers);
