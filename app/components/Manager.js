/**
 * Created by kinneretzin on 26/09/2016.
 */

import React, { Component, PropTypes } from 'react';
import Consts from '../utils/consts';

export default class Manager extends Component {
    static propTypes = {
        manager: PropTypes.object.isRequired
    };

    renderStatusIcon(status, maintenance) {
        var color = status ? (status === Consts.MANAGER_RUNNING ?
                    (maintenance !== Consts.MAINTENANCE_DEACTIVATED ? 'yellow' : 'green') : 'red') : 'grey';

        let {Icon} = Stage.Basic;
        return <Icon name='circle' color={color} className='statusIcon'/>;
    }

    render() {
        return (
            <div className='manager'>
                {this.props.manager.ip}
                {this.renderStatusIcon(this.props.manager.status, this.props.manager.maintenance)}
            </div>
        );
    }
}

