/**
 * Created by pawelposel on 17/11/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';

export default class TableDataCell extends Component {
    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string
    };

    render() {
        return <td className={this.props.className}>{this.props.children}</td>;
    }
}
