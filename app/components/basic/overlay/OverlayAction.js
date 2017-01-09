'use strict';
/**
 * Created by pawelposel on 22/11/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class OverlayAction extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        onClick: PropTypes.func,
        title: PropTypes.string
    };

    render () {
        return (
            <div onClick={(event)=>{event.stopPropagation(); this.props.onClick(event)}} data-tooltip={this.props.title}>{this.props.children}</div>
        );
    }
}

