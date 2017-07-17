/**
 * Created by pposel on 08/05/2017.
 */

import React, { Component, PropTypes } from 'react';
import {Icon} from 'semantic-ui-react'

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
 * <PrivateMarker title='Private Marker' show={true} />
 *```
 */
export default class PrivateMarker extends Component {

    /**
     * @property {boolean} [show=false] If 'true' the component will be displayed
     * @property {string} [title=''] Tooltip text when mouse is over the component
     * @property {string} [className=''] Name of the style class to be added
     */
    static propTypes = {
        show: PropTypes.bool,
        title: PropTypes.string,
        className: PropTypes.string
    };

    static defaultProps = {
        show: false,
        title: '',
        className: ''
    };

    render() {
        if (!this.props.show) {
            return null;
        }

        return (
            <Icon name="lock" color="red" title={this.props.title} className={this.props.className}/>
        );
    }
}

