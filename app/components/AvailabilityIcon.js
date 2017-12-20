/**
 * Created by edenp on 17/12/2017.
 */

import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import {Icon} from 'semantic-ui-react';
import consts from '../utils/consts';

/**
 * AvailabilityIcon - a component showing an availability icon depending on resource availability.
 */
export default class AvailabilityIcon extends Component {

    /**
     * @property {string} [availability] the current availability, one from ['tenant', 'private', 'global'].
     */
    static propTypes = {
        availability: PropTypes.oneOf([
            consts.availability.PRIVATE,
            consts.availability.TENANT,
            consts.availability.GLOBAL]).isRequired
    };

    render() {
        const ICON_PROPS = {
            private: {name: 'lock', color: 'red', title: 'Private resource'},
            tenant: {name: 'user', color: 'green', title: 'Tenant resource'},
            global: {name: 'globe', color: 'blue', title: 'Global resource'}
        };

        let icon = ICON_PROPS[this.props.availability];
        return (
        <Icon name={icon.name} color={icon.color} title={icon.title} {..._.omit(this.props, 'availability')}/>
        );
    }
}

