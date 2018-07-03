/**
 * Created by edenp on 11/10/2017.
 */

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Consts from '../utils/consts';
import Login from '../containers/Login';
import ErrorPage from '../containers/ErrorPage';
import NoTenants from '../containers/NoTenants';
import Logo from '../containers/Logo';

export default class LogoPage extends Component {
    render () {
        return (
            <div className="logoPage ui segment basic">
                <Logo />
                <Switch>
                    <Route path={Consts.LOGIN_PAGE_PATH} component={Login}/>
                    <Route path={Consts.ERROR_PAGE_PATH} component={ErrorPage}/>
                    <Route path={Consts.ERROR_NO_TENANTS_PAGE_PATH} component={NoTenants}/>
                </Switch>
            </div>
        );
    }
}
