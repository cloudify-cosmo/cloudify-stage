'use strict';
/**
 * Created by kinneretzin on 8/23/15.
 */

import React, { Component, PropTypes } from 'react';

export default class ModalBody extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired
    };

    render () {
        return (
            <div className="content">
                {this.props.children}
            </div>
        );
    }
}

