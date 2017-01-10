/**
 * Created by jakubniezgoda on 09/12/2016.
 */
  
import React, { Component, PropTypes } from 'react';

export default class GridRowExpandable extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        className: PropTypes.string,
        isExpanded: PropTypes.bool,
        numberOfColumns: PropTypes.number
    };

    static defaultProps = {
        isExpanded: false,
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
 