/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

export default class GridRow extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        select: PropTypes.bool,
        onClick: PropTypes.func
    };

    static defaultProps = {
        select: false
    };

    render() {
        return (
            <tr className={this.props.select?"active":""} onClick={this.props.onClick}>
                {this.props.children}
            </tr>
        );
    }
}
 