/**
 * Created by jakubniezgoda on 18/04/2018.
 */

import React, {Component} from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader/root'

import Consts from '../utils/consts';
import Layout from '../containers/layout/Layout';
import LogoPage from './LogoPage';
import LoginPage from '../containers/LoginPage';
import LicensePage from '../containers/LicensePage';
import MaintenanceMode from '../containers/maintenance/MaintenanceModePageMessage';
import {ExternalRedirect} from './ExternalRedirect';

class Routes extends Component {
    render() {
        return (
            <Switch>
                <Route exact path={Consts.LOGIN_PAGE_PATH} render={() =>
                    this.props.isSamlEnabled
                        ? <ExternalRedirect url={this.props.samlSsoUrl} />
                        : <LoginPage />
                } />
                <Route exact path={Consts.LOGOUT_PAGE_PATH} render={() =>
                    this.props.isSamlEnabled
                        ? <ExternalRedirect url={this.props.samlPortalUrl} />
                        : <Redirect to={Consts.LOGIN_PAGE_PATH} />
                } />
                <Route exact path={Consts.ERROR_PAGE_PATH} component={LogoPage} />
                <Route exact path={Consts.ERROR_NO_TENANTS_PAGE_PATH} component={LogoPage} />
                {
                    this.props.isLoggedIn && this.props.isLicenseRequired &&
                    <Route exact path={Consts.LICENSE_PAGE_PATH} component={LicensePage} />
                }
                {
                    this.props.isLoggedIn &&
                    <Route exact path={Consts.MAINTENANCE_PAGE_PATH} component={MaintenanceMode}/>
                }
                <Route render={(props) => (
                    this.props.isLoggedIn
                        ? this.props.isInMaintenanceMode
                            ? <Redirect to={Consts.MAINTENANCE_PAGE_PATH} />
                            : this.props.isProductOperational
                                ? <Layout {...props} />
                                : <Redirect to={Consts.LICENSE_PAGE_PATH} />
                        : <Redirect to={Consts.LOGIN_PAGE_PATH} />
                )} />
            </Switch>
        );
    }
}

export default hot(Routes);