/**
 * Created by edenp on 17/12/2017.
 */

import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import {Icon} from 'semantic-ui-react';
import consts from '../utils/consts';

/**
 * VisibilityIcon - a component showing an visibility icon depending on resource visibility.
 */
export default class VisibilityIcon extends Component {

    /**
     * @property {string} [visibility] the current visibility, one from ['tenant', 'private', 'global'].
     */
    static propTypes = {
        visibility: PropTypes.oneOf([
            consts.visibility.PRIVATE.name,
            consts.visibility.TENANT.name,
            consts.visibility.GLOBAL.name]).isRequired
    };

    render() {
        let data = _.find(consts.visibility, {name: this.props.visibility});
        return (
            <Icon name={data.icon} color={data.color} title={data.title} {..._.omit(this.props, 'visibility')}/>
        );
    }
}

