/**
 * Created by kinneretzin on 30/08/2016.
 */

/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';


export default class EditIcon extends Component {
    static propTypes = {
        onClick: PropTypes.func
    };

    static defaultProps = {
        onClick: function(){}
    }

    render() {
        return (
            <i className={"setting link icon small" + this.props.className} onClick={this.props.onClick}>
                {this.props.children}
            </i>
        );
    }
}

