/**
 * Created by pawelposel on 03/11/2016.
 */

import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import Managers from '../components/Managers'

const mapStateToProps = (state, ownProps) => {
    return {
        managers: ownProps.managers
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onManagerConfig: () => {
            dispatch(push('/login'));
        },

        onManagerChange: () => {
            //TODO: handle multiple manager switching
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Managers);
