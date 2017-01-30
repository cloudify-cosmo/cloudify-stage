/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

export default class TableFilter extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        className: PropTypes.string
    };

    render() {
        return (
            <div className={`field ${this.props.className}`}>
                {this.props.children}
            </div>
        );
    }
}
