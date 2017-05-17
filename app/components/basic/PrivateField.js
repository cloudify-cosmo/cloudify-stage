/**
 * Created by pposel on 08/05/2017.
 */


import React, { Component, PropTypes } from 'react';
import {Icon} from 'semantic-ui-react'

export default class PrivateField extends Component {

    static propTypes = {
        lock: PropTypes.bool,
        onClick: PropTypes.func,
        title: PropTypes.string,
        className: PropTypes.string
    };

    render() {
        return (
            <Icon name={this.props.lock?'lock':'unlock'} link className={this.props.className}
                  color={this.props.lock?'red':'black'} title={this.props.title}
                  onClick={this.props.onClick}/>
        );
    }
}

