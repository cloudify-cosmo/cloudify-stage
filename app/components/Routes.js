/**
 * Created by jakubniezgoda on 18/04/2018.
 */

import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import Consts from '../utils/consts';
import Layout from '../containers/layout/Layout';
import LogoPage from './LogoPage';
import LoginPage from '../containers/LoginPage';
import LicensePage from '../containers/LicensePage';
import MaintenanceMode from '../containers/maintenance/MaintenanceModePageMessage';
import { ExternalRedirect } from './ExternalRedirect';

class Routes extends Component {
    render() {
        const {
            isInMaintenanceMode,
            isLicenseRequired,
            isLoggedIn,
            isProductOperational,
            isSamlEnabled,
            samlPortalUrl,
            samlSsoUrl
        } = this.props;
        return (
            <Switch>
                <Route
                    exact
                    path={Consts.LOGIN_PAGE_PATH}
                    render={() => (isSamlEnabled ? <ExternalRedirect url={samlSsoUrl} /> : <LoginPage />)}
                />
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
                {isLoggedIn && isLicenseRequired && (
                    <Route exact path={Consts.LICENSE_PAGE_PATH} component={LicensePage} />
                )}
                {isLoggedIn && <Route exact path={Consts.MAINTENANCE_PAGE_PATH} component={MaintenanceMode} />}
                <Route
                    render={props =>
                        isLoggedIn ? (
                            isInMaintenanceMode ? (
                                <Redirect to={Consts.MAINTENANCE_PAGE_PATH} />
                            ) : isProductOperational ? (
                                <Layout {...props} />
                            ) : (
                                <Redirect to={Consts.LICENSE_PAGE_PATH} />
                            )
                        ) : (
                            <Redirect to={Consts.LOGIN_PAGE_PATH} />
                        )
                    }
                />
            </Switch>
        );
    }
}

export default Routes;
