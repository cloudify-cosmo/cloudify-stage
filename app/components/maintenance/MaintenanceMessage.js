/**
 * Created by pposel on 16/02/2017.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import Consts from '../../utils/consts';

export default class MaintenanceMessage extends Component {

    static propTypes = {
        manager: PropTypes.object.isRequired
    };

    render() {
        if (this.props.manager.status !== Consts.MANAGER_RUNNING ||
            this.props.manager.maintenance === Consts.MAINTENANCE_DEACTIVATED) {
            return null;
        }

        return (
            <div className="ui yellow small message maintenance">
                Server is in maintenance mode, some actions will not be available
            </div>
        );
    }
}
