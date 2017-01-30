/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

export default class SegmentItem extends Component {

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
            <div className={`ui ${this.props.select?'secondary inverted':''} segment`} onClick={this.props.onClick}>
                {this.props.children}
            </div>
        );
    }
}
