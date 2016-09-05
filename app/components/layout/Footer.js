/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';


export default class Footer extends Component {
    render() {
        return (
            <div className="ui bottom fixed menu mini">
                <a className="item">Help</a>
                <a className="item">About</a>
                <a className="item">Terms</a>
            </div>
        );
    }
}
