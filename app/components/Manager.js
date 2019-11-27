/**
 * Created by kinneretzin on 26/09/2016.
 */

import React from 'react';
import PropTypes from 'prop-types';

import SystemStatusIcon from '../containers/SystemStatusIcon';
import SystemServicesStatus from '../containers/SystemServicesStatus';
import { Popup } from './basic/index';

export default function Manager({ onServicesStatusOpen, showServicesStatus }) {
    return showServicesStatus ? (
        <Popup wide hoverable position="bottom right" onOpen={onServicesStatusOpen}>
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
