'use strict';
/**
 * Created by pawelposel on 22/11/2016.
 */

import React, { Component, PropTypes } from 'react';
import Popup from '../Popup';

/**
 * OverlayAction is integral part of {@link Overlay} component.
 *
 * ## Access
 * `Stage.Basic.Overlay.Action`
 */
export default class OverlayAction extends Component {

    /**
     * propTypes
     * @property {object[]} children primary content
     * @property {function} [onClick] function to be called on click action
     * @property {string} [title] text to be displayed in popup on mouseover action
     */
    static propTypes = {
        children: PropTypes.any.isRequired,
        onClick: PropTypes.func,
        title: PropTypes.string
    };

    render () {
        return (
            <div onClick={(event)=>{event.stopPropagation(); this.props.onClick(event)}}>
                {
                    this.props.title
                    ?
                        <Popup position='top left' wide>
                            <Popup.Trigger>
                                <div>{this.props.children}</div>
                            </Popup.Trigger>
                            <span>{this.props.title}</span>
                        </Popup>
                    :
                        this.props.children
                }
            </div>
        );
    }
}

