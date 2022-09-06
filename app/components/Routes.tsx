import React from 'react';
import type { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import Consts from '../utils/consts';
import LogoPage from './LogoPage';
import LoginPage from './LoginPage';
import ExternalRedirect from './ExternalRedirect';
import AuthRoutes from './AuthRoutes';
import type { ReduxState } from '../reducers';
import ExternalLogin from './ExternalLogin';

const Routes: FunctionComponent = () => {
    const isLoggedIn = useSelector((state: ReduxState) => state.manager.auth.state === 'loggedIn');
    const isSamlEnabled = useSelector((state: ReduxState) => _.get(state, 'config.app.saml.enabled', false));
    const samlPortalUrl = useSelector((state: ReduxState) => _.get(state, 'config.app.saml.portalUrl', ''));
    const theme = useSelector((state: ReduxState) => _.get(state, 'config.app.whiteLabel', {}));

    return (
        <ThemeProvider theme={theme}>
            <Switch>
                <Route exact path={Consts.PAGE_PATH.LOGIN} component={LoginPage} />
                <Route exact path={Consts.PAGE_PATH.EXTERNAL_LOGIN} component={ExternalLogin} />
                <Route
                    exact
                    path={Consts.PAGE_PATH.LOGOUT}
                    render={() =>
                        isSamlEnabled ? (
                            <ExternalRedirect url={samlPortalUrl} />
                        ) : (
                            <Redirect to={Consts.PAGE_PATH.LOGIN} />
                        )
                    }
                />
                <Route exact path={Consts.PAGE_PATH.ERROR} component={LogoPage} />
                <Route exact path={Consts.PAGE_PATH.ERROR_NO_TENANTS} component={LogoPage} />
                <Route exact path={Consts.PAGE_PATH.ERROR_404} component={LogoPage} />
                <Route
                    render={() => {
                        if (isLoggedIn) return <AuthRoutes />;
                        return <Redirect to={Consts.PAGE_PATH.LOGIN} />;
                    }}
                />
            </Switch>
        </ThemeProvider>
    );
};

export default Routes;
