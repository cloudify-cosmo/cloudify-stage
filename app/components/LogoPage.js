/**
 * Created by edenp on 11/10/2017.
 */

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Consts from '../utils/consts';
import Login from '../containers/Login';
import ErrorPage from '../containers/ErrorPage';
import NoTenants from '../containers/NoTenants';
import LicensePage from '../containers/LicensePage';
import Logo from '../containers/Logo';

export default class LogoPage extends Component {
    render () {
        return (
            <div className="logoPage ui segment basic">
                <Logo />
                <Switch>
                    <Route exact path={Consts.LOGIN_PAGE_PATH} component={Login} />
                    <Route exact path={Consts.ERROR_PAGE_PATH} component={ErrorPage} />
                    <Route exact path={Consts.ERROR_NO_TENANTS_PAGE_PATH} component={NoTenants} />
                    <Route exact path={Consts.LICENSE_PAGE_PATH} component={LicensePage} />
                </Switch>
            </div>
        );
    }
}
