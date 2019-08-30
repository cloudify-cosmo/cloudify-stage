/**
 * Created by edenp on 17/12/2017.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _ from 'lodash';

import { Icon, Popup } from './index';
import consts from '../../utils/consts';

/**
 * VisibilityIcon - a component showing an visibility icon depending on resource visibility.
 */
export default class VisibilityIcon extends Component {
    /**
     * @property {string} [visibility='unknown'] the current visibility, one from ['tenant', 'private', 'global', 'unknown'].
     * @property {string} [showTitle=true] if set to true, then on hovering icon title will be shown in popup
     */
    static propTypes = {
        visibility: PropTypes.oneOf([
            consts.visibility.PRIVATE.name,
            consts.visibility.TENANT.name,
            consts.visibility.GLOBAL.name,
            consts.visibility.UNKNOWN.name
        ]),
        showTitle: PropTypes.bool
    };

    static defaultProps = {
        showTitle: true,
        visibility: consts.visibility.UNKNOWN.name
    };

    render() {
        const data = _.find(consts.visibility, { name: this.props.visibility }) || consts.visibility.UNKNOWN;

        return this.props.showTitle ? (
            <Popup
                trigger={
                    <Icon
                        name={data.icon}
                        color={data.color}
                        {..._.omit(this.props, _.keys(VisibilityIcon.propTypes))}
                    />
                }
                content={data.title}
            />
        ) : (
            <Icon name={data.icon} color={data.color} {..._.omit(this.props, _.keys(VisibilityIcon.propTypes))} />
        );
    }
}
