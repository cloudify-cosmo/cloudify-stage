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
            consts.availability.PRIVATE.name,
            consts.availability.TENANT.name,
            consts.availability.GLOBAL.name]).isRequired
    };

    render() {
        let data = _.find(consts.availability, {name: this.props.availability});
        return (
            <Icon name={data.icon} color={data.color} title={data.title} {..._.omit(this.props, 'availability')}/>
        );
    }
}

