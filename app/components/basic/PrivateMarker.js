/**
 * Created by pposel on 08/05/2017.
 */


import React, { Component, PropTypes } from 'react';
import {Icon} from 'semantic-ui-react'

export default class PrivateMarker extends Component {

    static propTypes = {
        show: PropTypes.bool,
        title: PropTypes.string,
        className: PropTypes.string
    };

    render() {
        if (!this.props.show) {
            return null;
        }

        return (
            <Icon name="lock" color="red" title={this.props.title} className={this.props.className}/>
        );
    }
}

