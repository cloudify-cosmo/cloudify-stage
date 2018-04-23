/**
 * Created by jakubniezgoda on 18/04/2018.
 */

import React, {Component} from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import Layout from '../containers/layout/Layout';
import LogoPage from './LogoPage';
import MaintenanceMode from '../containers/maintenance/MaintenanceModePageMessage';

export default class Routes extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/login' component={LogoPage} />
                <Route exact path='/error' component={LogoPage} />
                <Route exact path='/noTenants' component={LogoPage} />
                <Route exact path='/maintenance' component={MaintenanceMode} />
                <Redirect from='/logout' to='/login' />
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
