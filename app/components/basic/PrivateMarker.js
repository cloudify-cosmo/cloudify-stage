/**
 * Created by pposel on 08/05/2017.
 */

import React, { Component, PropTypes } from 'react';
import {Icon} from 'semantic-ui-react';
import Consts from '../../utils/consts';

/**
 * PrivateMarker - a simple red padlock icon with a show/hide switch
 *
 * ## Access
 * `Stage.Basic.PrivateMarker`
 *
 * ## Usage
 *
 * ### PrivateMarker (show)
 *
 * ![PrivateMarker](manual/asset/privateMarker/PrivateMarker_0.png)
 * ```
 * <PrivateMarker title='Private Marker' availability={'private'} />
 *```
 */
export default class PrivateMarker extends Component {

    /**
     * @property {string} [availability=''] resource availability - in ['private', 'tenant, 'global']
     * @property {string} [title=''] Tooltip text when mouse is over the component
     * @property {string} [className=''] Name of the style class to be added
     */
    static propTypes = {
        availability: PropTypes.string,
        title: PropTypes.string,
        className: PropTypes.string
    };

    static defaultProps = {
        availability: '',
        title: '',
        className: ''
    };

    render() {
        if (this.props.availability !== Consts.PRIVATE_RESOURCE) {
            return null;
        }

        return (
            <Icon name="lock" color="red" title={this.props.title} className={this.props.className}/>
        );
    }
}

