/**
 * Created by edenp on 11/10/2017.
 */

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
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
                    <Route path='/login' component={Login}/>
                    <Route path='/error' component={ErrorPage}/>
                    <Route path='/noTenants' component={NoTenants}/>
                </Switch>
            </div>
        );
    }
}
