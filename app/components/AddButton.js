/**
 * Created by kinneretzin on 30/08/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';


export default class AddButton extends Component {
    static propTypes = {
        children: PropTypes.any.isRequired,
        onClick: PropTypes.func
    };

    static defaultProps = {
        onClick: function(){}
    }

    render() {
        return (
            <button className={'ui labeled icon button tiny teal basic compact ' + this.props.className} onClick={this.props.onClick}>
                <i className="plus icon"></i>
                {this.props.children}
            </button>
        );
    }
}

