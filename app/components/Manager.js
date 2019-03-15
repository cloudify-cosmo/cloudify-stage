/**
 * Created by kinneretzin on 26/09/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import Consts from '../utils/consts';
import Services from '../containers/Services';
import {Icon, Popup} from './basic/index';

export default class Manager extends Component {
    static propTypes = {
        manager: PropTypes.object.isRequired,
        showServicesStatus: PropTypes.bool.isRequired
    };

    _areAllServicesRunning(services) {
        const runningState = 'running';
        const remoteState = 'remote';
        let allServicesRunning = true;

        _.forEach(services, (service) => {
            _.forEach(service.instances, (instance) => {
                if (instance.state !== runningState && instance.state !== remoteState) {
                    allServicesRunning = false;
                    return false;
                }
            });
            if (!allServicesRunning) {
                return false;
            }
        });

        return allServicesRunning;
    }

    _renderStatusIcon(status, maintenance) {
        const allServicesRunning = this._areAllServicesRunning(status.services);

        const color = status.status
            ? (status.status === Consts.MANAGER_RUNNING
                ? (maintenance !== Consts.MAINTENANCE_DEACTIVATED || !allServicesRunning
                    ? 'yellow'
                    : 'green')
                : 'red')
            : 'grey';

        return <Icon name='signal' circular inverted size="small" color={color} className='statusIcon'/>;
    }

    render() {
        let managerInfo = () =>
            <div className="managerMenu">
                {this._renderStatusIcon(this.props.manager.status, this.props.manager.maintenance)}
            </div>;

        return (
            this.props.showServicesStatus
            ?
                <Popup wide hoverable position='bottom right' onOpen={this.props.onServicesStatusOpen}>
                    <Popup.Trigger>{managerInfo()}</Popup.Trigger>
                    <Services />
                </Popup>
            :
                managerInfo()
        );
    }
}

