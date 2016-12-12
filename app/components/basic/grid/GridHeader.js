/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

export default class GridHeader extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
    };

    render() {
        return (
            <thead>
                {this.props.children}
            </thead>
        );
    }
}
 