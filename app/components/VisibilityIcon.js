/**
 * Created by edenp on 17/12/2017.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import _ from 'lodash';
import {Icon} from 'semantic-ui-react';
import consts from '../utils/consts';

/**
 * VisibilityIcon - a component showing an visibility icon depending on resource visibility.
 */
export default class VisibilityIcon extends Component {

    /**
     * @property {string} visibility the current visibility, one from ['tenant', 'private', 'global'].
     * @property {string} [showTitle] if set to true, then on hovering icon title will be shown in popup
     */
    static propTypes = {
        visibility: PropTypes.oneOf([
            consts.visibility.PRIVATE.name,
            consts.visibility.TENANT.name,
            consts.visibility.GLOBAL.name]).isRequired,
        showTitle: PropTypes.bool
    };

    static defaultProps = {
        showTitle: true
    };

    render() {
        let {Popup} = Stage.Basic;
        let data = _.find(consts.visibility, {name: this.props.visibility});
        return this.props.showTitle
            ? <Popup trigger={<Icon name={data.icon} color={data.color} {..._.omit(this.props, _.keys(VisibilityIcon.propTypes))}/>} content={data.title} />
            : <Icon name={data.icon} color={data.color} {..._.omit(this.props, 'visibility')}/>;
    }
}

