/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

export default class SegmentItem extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        selected: PropTypes.bool,
        onClick: PropTypes.func,
        className: PropTypes.string
    };

    static defaultProps = {
        selected: false,
        className: ""
    };

    render() {
        return (
            <div className={`ui ${this.props.selected?'secondary inverted':''} segment ${this.props.className}`} onClick={this.props.onClick}>
                {this.props.children}
            </div>
        );
    }
}
