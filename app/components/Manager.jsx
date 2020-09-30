/**
 * Created by kinneretzin on 26/09/2016.
 */

import React from 'react';
import PropTypes from 'prop-types';

import SystemStatusIcon from '../containers/status/SystemStatusIcon';
import SystemServicesStatus from '../containers/status/SystemServicesStatus';
import { Popup } from './basic/index';

export default function Manager({ onServicesStatusOpen, showServicesStatus }) {
    return showServicesStatus ? (
        <Popup wide="very" hoverable onOpen={onServicesStatusOpen}>
            <Popup.Trigger>
                <div>
                    <SystemStatusIcon />
                </div>
            </Popup.Trigger>
            <SystemServicesStatus />
        </Popup>
    ) : (
        <SystemStatusIcon />
    );
}

Manager.propTypes = {
    onServicesStatusOpen: PropTypes.func.isRequired,
    showServicesStatus: PropTypes.bool.isRequired
};
