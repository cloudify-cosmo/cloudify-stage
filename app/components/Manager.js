/**
 * Created by kinneretzin on 26/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class Manager extends Component {
    static propTypes = {
        manager: PropTypes.object.isRequired
    };


    renderStatusIcon(status) {
        let {Icon} = Stage.Basic;
        return <Icon name='circle' color={status ? (status === 'running' ? 'green' : 'red') : 'grey' } className='statusIcon'/>;
    }

    render() {
        return (
            <div className='manager'>
                {this.props.manager.ip}
                {this.renderStatusIcon(this.props.manager.status)}
            </div>
        );
    }
}

