/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

export default class TableDataCell extends Component {

    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string
    };

    render() {
        return (
            <td className={this.props.className}>
                {this.props.children}
            </td>
        );
    }
}
