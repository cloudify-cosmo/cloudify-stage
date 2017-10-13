/**
 * Created by edenp on 8/17/17.
 */

import React, { Component, PropTypes } from 'react';
import LinkToLogin from '../containers/LinkToLogin';

export default class NoTenants extends Component {
    render () {
        return (
                <div className="ui raised very padded text container segment center aligned noTenantsContainer">
                    <h2 className="ui header">User don't have any tenants</h2>
                    <p>Unfortunately you cannot login since you don't have any tenants. Ask the admin to assign you to a tenant.</p>
                    <LinkToLogin/>
                </div>
        );
    }
}