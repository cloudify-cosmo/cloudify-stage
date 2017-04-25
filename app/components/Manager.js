/**
 * Created by kinneretzin on 26/09/2016.
 */

import React, { Component, PropTypes } from 'react';
import Consts from '../utils/consts';
import Services from './Services';
import {Icon, Popup} from './basic/index';

export default class Manager extends Component {
    static propTypes = {
        manager: PropTypes.object.isRequired
    };

    renderStatusIcon(status, maintenance) {
        var color = status ? (status === Consts.MANAGER_RUNNING ?
                    (maintenance !== Consts.MAINTENANCE_DEACTIVATED ? 'yellow' : 'green') : 'red') : 'grey';

        return <Icon name='signal' circular inverted size="small" color={color} className='statusIcon'/>;
    }

    render() {
        return (
            <Popup wide hoverable>
                <Popup.Trigger><div className="managerMenu">
                    {this.renderStatusIcon(this.props.manager.status, this.props.manager.maintenance)}
                    <span>{this.props.manager.ip} <span className="managerVersion">(v{this.props.manager.serverVersion})</span></span>
                </div></Popup.Trigger>

                <Services services={this.props.manager.services}/>
            </Popup>
        );
    }
}

