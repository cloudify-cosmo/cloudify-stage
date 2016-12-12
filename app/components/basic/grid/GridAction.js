/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

export default class GridAction extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
    };

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
 