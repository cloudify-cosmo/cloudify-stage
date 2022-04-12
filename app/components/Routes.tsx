import Cookies from 'js-cookie';
import React from 'react';
import type { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import Consts from '../utils/consts';
import LogoPage from './LogoPage';
import LoginPage from '../containers/LoginPage';
import ExternalRedirect from './ExternalRedirect';
import AuthRoutes from './AuthRoutes';
import type { ReduxState } from '../reducers';
import SamlLogin from './SamlLogin';

const Routes: FunctionComponent = () => {
    const isLoggedIn = useSelector((state: ReduxState) => state.manager.auth.state === 'loggedIn');
    const isSamlEnabled = useSelector((state: ReduxState) => _.get(state, 'config.app.saml.enabled', false));
    const isSamlLogin = isSamlEnabled && !!Cookies.get(Consts.ROLE_COOKIE_NAME);
    const samlPortalUrl = useSelector((state: ReduxState) => _.get(state, 'config.app.saml.portalUrl', ''));
    const theme = useSelector((state: ReduxState) => _.get(state, 'config.app.whiteLabel', {}));

    return (
        <ThemeProvider theme={theme}>
            <Switch>
                <Route exact path={Consts.LOGIN_PAGE_PATH} component={LoginPage} />
                <Route
                    exact
                    path={Consts.LOGOUT_PAGE_PATH}
                    render={() =>
                        isSamlEnabled ? (
                            <ExternalRedirect url={samlPortalUrl} />
                        ) : (
                            <Redirect to={Consts.LOGIN_PAGE_PATH} />
                        )
                    }
                />
                <Route exact path={Consts.ERROR_PAGE_PATH} component={LogoPage} />
                <Route exact path={Consts.ERROR_NO_TENANTS_PAGE_PATH} component={LogoPage} />
                <Route exact path={Consts.ERROR_404_PAGE_PATH} component={LogoPage} />
                <Route
                    render={() => {
                        if (isLoggedIn) return <AuthRoutes />;
                        if (isSamlLogin) return <SamlLogin />;
                        return <Redirect to={Consts.LOGIN_PAGE_PATH} />;
                    }}
                />
            </Switch>
        </ThemeProvider>
    );
};

export default Routes;
