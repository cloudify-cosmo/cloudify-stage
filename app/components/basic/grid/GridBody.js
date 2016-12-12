/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

export default class GridBody extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
    };

    render() {
        return (
            <tbody>
                {this.props.children}
            </tbody>
        );
    }
}
 