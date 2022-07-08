import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import type { Dispatch } from 'redux';
import LoginPage from '../components/LoginPage';
import { login } from '../actions/managers';
import type { ReduxState } from '../reducers';

const mapStateToProps = (state: ReduxState) => {
    const { config, manager } = state;
    return {
        username: manager.auth.username,
        isLoggingIn: manager.auth.state === 'loggingIn',
        loginError: manager.auth.error,
        mode: _.get(config, 'mode'),
        whiteLabel: _.get(config, 'app.whiteLabel'),
        isSamlEnabled: _.get(config, 'app.saml.enabled', false),
        samlSsoUrl: _.get(config, 'app.saml.ssoUrl', '')
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        onLogin: (username: string, password: string, redirect?: string | null) => {
            dispatch(login(username, password, redirect));
        }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPage));
