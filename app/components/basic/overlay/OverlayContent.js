'use strict';
/**
 * Created by pawelposel on 22/11/2016.
 */
 
import React, { Component, PropTypes } from 'react';

export default class OverlayContent extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired
    };

    render () {
        return (
            <div className="content">{this.props.children}</div>
        );
    }
}

