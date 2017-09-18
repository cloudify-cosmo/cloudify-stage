/**
 * Created by edenp on 8/17/17.
 */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class NoTenants extends Component {
    static propTypes = {
        portalUrl: PropTypes.string
    };

    render () {
        return (
            <div className="noTenantsPage ui segment basic">
                <div className="logo">
                </div>
                <div className="ui raised very padded text container segment center aligned noTenantsContainer">
                    <h2 className="ui header">User don't have any tenants</h2>
                    <p>Unfortunately you cannot login since you don't have any tenants. Ask the admin to assign you to a tenant.</p>
                    {
                        this.props.portalUrl ?
                            <a href={this.props.portalUrl}>Back to apps</a>
                            :
                            <Link to={{pathname: '/login', search: this.props.location.search}}>Back to login</Link>
                    }
                </div>
            </div>
        );
    }
}