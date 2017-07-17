'use strict';
/**
 * Created by pawelposel on 22/11/2016.
 */
 
import React, { Component, PropTypes } from 'react';

/**
 * OverlayContent is integral part of {@link Overlay} component.
 *
 * ## Access
 * `Stage.Basic.Overlay.Content`
 */
export default class OverlayContent extends Component {

    /**
     * propTypes
     * @property {object[]} children primary content
     */
    static propTypes = {
        children: PropTypes.any.isRequired
    };

    render () {
        return (
            <div className="content">{this.props.children}</div>
        );
    }
}

