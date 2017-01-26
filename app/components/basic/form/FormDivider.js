/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Form } from 'semantic-ui-react'

export default class FormDivider extends Component {

    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string
    };

    render() {
        return (
            <h4 className={`ui dividing header ${this.props.className}`}>
                {this.props.children}
            </h4>
        );
    }
}