'use strict';

import React, { Component, PropTypes } from 'react';

export default class ModalFooter extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired
    };

    render () {
        return (
            <div className="actions">
                {this.props.children}
            </div>
        );
    }
}

