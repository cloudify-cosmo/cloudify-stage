// @ts-nocheck File not migrated fully to TS

import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import LoginPage from '../components/LoginPage';
import { login } from '../actions/managers';

const mapStateToProps = state => {
    const { config, manager } = state;
    return {
        username: _.get(manager, 'username', ''),
        isLoggingIn: _.get(manager, 'isLoggingIn', false),
        loginError: _.get(manager, 'err', ''),
        mode: _.get(config, 'mode'),
        whiteLabel: _.get(config, 'app.whiteLabel'),
        isSamlEnabled: _.get(config, 'app.saml.enabled', false),
        samlSsoUrl: _.get(config, 'app.saml.ssoUrl', '')
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogin: (username, password, redirect) => {
            dispatch(login(username, password, redirect));
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPage));
