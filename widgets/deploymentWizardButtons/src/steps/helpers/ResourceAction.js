/**
 * Created by jakub.niezgoda on 09/08/2018.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ResourceAction extends Component {

    static propTypes = {
        children: PropTypes.any
    };

    render() {
        let action = this.props.children;

        return (
            <div>
                {action}
            </div>
        );
    }
}