/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';
import Highlight from 'react-highlight';

export default class HighlightText extends Component {

    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string
    };

    static defaultProps = {
        className: null,
    };

    render() {
        return <Highlight className={this.props.className}>{this.props.children}</Highlight>;
    }
}
 