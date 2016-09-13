/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';


export default class Header extends Component {
    render() {
        return (
            <div className="ui top fixed menu teal inverted">
                <div className="logo">
                    <img src="/app/images/Cloudify-logo.png"></img>
                </div>
            </div>
        );
    }
}
