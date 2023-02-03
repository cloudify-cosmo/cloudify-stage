import React from 'react';
import type { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import Consts from '../../utils/consts';
import NotFoundPage from './NotFoundPage';
import LoginPage from './LoginPage';
import LogoutPage from './LogoutPage';
import AuthRoutes from './AuthRoutes';
import type { ReduxState } from '../../reducers';
import ExternalLogin from './ExternalLogin';

const Routes: FunctionComponent = () => {
    const isLoggedIn = useSelector((state: ReduxState) => state.manager.auth.state === 'loggedIn');
    const theme = useSelector((state: ReduxState) => state.config.app.whiteLabel);

    return (
        <ThemeProvider theme={theme}>
            <Switch>
                <Route exact path={Consts.PAGE_PATH.LOGIN} component={LoginPage} />
                <Route exact path={Consts.PAGE_PATH.EXTERNAL_LOGIN} component={ExternalLogin} />
                <Route exact path={Consts.PAGE_PATH.LOGOUT} component={LogoutPage} />
                <Route exact path={Consts.PAGE_PATH.ERROR_404} component={NotFoundPage} />
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
