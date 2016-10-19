'use strict';

import React, { Component, PropTypes } from 'react';

export default class ModalHeader extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired
    };


    render () {
        return (
            <div className="header">
                {this.props.children}
            </div>
        );
    }
}


