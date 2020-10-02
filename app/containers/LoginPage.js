/**
 * Created by addihorowitz on 19/09/2016.
 */

import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import LoginPage from '../components/LoginPage';
import { login } from '../actions/managers';

const mapStateToProps = state => {
    return {
        username: state.manager ? state.manager.username : '',
        isLoggingIn: state.manager.isLoggingIn,
        loginError: state.manager ? state.manager.err : '',
        mode: state.config.mode,
        whiteLabel: state.config.app.whiteLabel
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogin: (username, password, redirect) => {
            dispatch(login(username, password, redirect));
        }
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(LoginPage)
);
