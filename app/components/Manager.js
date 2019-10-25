/**
 * Created by kinneretzin on 26/09/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import Consts from '../utils/consts';
import Services from '../containers/Services';
import { Icon, Popup } from './basic/index';

export default class Manager extends Component {
    static propTypes = {
        maintenanceStatus: PropTypes.string.isRequired,
        managerStatus: PropTypes.string.isRequired,
        onServicesStatusOpen: PropTypes.func.isRequired,
        showServicesStatus: PropTypes.bool.isRequired
    };

    render() {
        const { onServicesStatusOpen, maintenanceStatus, managerStatus, showServicesStatus } = this.props;

        const ManagerStatusIcon = () => {
            let color = 'grey';
            if (managerStatus === Consts.MANAGER_STATUS_FAIL) {
                color = 'red';
            } else if (maintenanceStatus !== Consts.MAINTENANCE_DEACTIVATED) {
                color = 'yellow';
            } else if (managerStatus === Consts.MANAGER_STATUS_OK) {
                color = 'green';
            }

            return (
                <div className="managerMenu">
                    <Icon name="signal" circular inverted size="small" color={color} className="statusIcon" />
                </div>
            );
        };

        return showServicesStatus ? (
            <Popup wide hoverable position="bottom right" onOpen={onServicesStatusOpen}>
                <Popup.Trigger>
                    <div>
                        <ManagerStatusIcon />
                    </div>
                </Popup.Trigger>
                <Services />
            </Popup>
        ) : (
            <ManagerStatusIcon />
        );
    }
}
