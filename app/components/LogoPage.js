/**
 * Created by edenp on 11/10/2017.
 */

import React, { Component, PropTypes } from 'react';

export default class LogoPage extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired
    };

    render () {
        return (
            <div className="logoPage ui segment basic">
                <div className="logo">
                </div>
                {this.props.children}
            </div>
        );
    }
}
