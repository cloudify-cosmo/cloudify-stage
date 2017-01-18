/**
 * Created by jakubniezgoda on 11/01/2017.
 */
  
import React, { Component, PropTypes } from 'react';

export default class GridDataExpandable extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        className: PropTypes.string,
        numberOfColumns: PropTypes.number
    };

    static defaultProps = {
        numberOfColumns: 0
    };

    render() {
        return (
            <tr>
                <td className={this.props.className} colSpan={this.props.numberOfColumns}>
                    {this.props.children}
                </td>
            </tr>
        );
    }
}
 