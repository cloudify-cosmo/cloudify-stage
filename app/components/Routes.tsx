// @ts-nocheck File not migrated fully to TS

import PropTypes from 'prop-types';
import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import Consts from '../utils/consts';
import LogoPage from './LogoPage';
import LoginPage from '../containers/LoginPage';
import ExternalRedirect from './ExternalRedirect';
import AuthRoutes from './AuthRoutes';

export default function Routes({ isLoggedIn, isSamlEnabled, samlPortalUrl, theme }) {
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
                    render={() =>
                        isLoggedIn ? (
                            <AuthRoutes isSamlEnabled={isSamlEnabled} />
                        ) : (
                            <Redirect to={Consts.LOGIN_PAGE_PATH} />
                        )
                    }
                />
            </Switch>
        </ThemeProvider>
    );
}

Routes.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    isSamlEnabled: PropTypes.bool.isRequired,
    samlPortalUrl: PropTypes.string.isRequired,
    theme: PropTypes.shape({
        mainColor: PropTypes.string,
        headerTextColor: PropTypes.string
    }).isRequired
};
