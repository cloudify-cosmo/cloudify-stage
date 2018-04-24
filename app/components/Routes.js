/**
 * Created by jakubniezgoda on 18/04/2018.
 */

import React, {Component} from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader'

import Layout from '../containers/layout/Layout';
import LogoPage from './LogoPage';
import MaintenanceMode from '../containers/maintenance/MaintenanceModePageMessage';
import {ExternalRedirect} from './ExternalRedirect';

class Routes extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/login' render={() =>
                    this.props.isSamlEnabled
                        ? <ExternalRedirect url={this.props.samlSsoUrl} />
                        : <LogoPage/>
                } />
                <Route exact path='/logout' render={() =>
                    this.props.isSamlEnabled
                        ? <ExternalRedirect url={this.props.samlPortalUrl} />
                        : <Redirect to='/login'/>
                } />
                <Route exact path='/error' component={LogoPage} />
                <Route exact path='/noTenants' component={LogoPage} />
                <Route exact path='/maintenance' component={MaintenanceMode} />
                <Route render={(props) => (
                    this.props.isLoggedIn
                        ? this.props.isInMaintenanceMode
                            ? ( <Redirect to='/maintenance'/> )
                            : ( <Layout {...props} /> )
                        : ( <Redirect to='/login' /> )
                )} />
            </Switch>
        );
    }
};

export default hot(module)(Routes);