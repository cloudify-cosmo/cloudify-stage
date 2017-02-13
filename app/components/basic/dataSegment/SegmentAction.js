/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

export default class SegmentAction extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
    };

    render() {
        return (
            <div className="field actionField">
                {this.props.children}
            </div>
        );
    }
}
 