'use strict';
/**
 * Created by pawelposel on 22/11/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class OverlayAction extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        onClick: PropTypes.func
    };

    render () {
        return (
            <div onClick={this.props.onClick}>{this.props.children}</div>
        );
    }
}

