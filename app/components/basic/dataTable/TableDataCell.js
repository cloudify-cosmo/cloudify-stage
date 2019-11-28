/**
 * Created by pawelposel on 17/11/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';

export default class TableDataCell extends Component {
    static propTypes = {
        children: PropTypes.any.isRequired,
        className: PropTypes.string,
        rowsSpan: PropTypes.number,
        style: PropTypes.object
    };

    static defaultProps = {
        className: '',
        rowsSpan: 1,
        style: {}
    };

    render() {
        return (
            <td rowSpan={this.props.rowsSpan} className={this.props.className} style={this.props.style}>
                {this.props.children}
            </td>
        );
    }
}
