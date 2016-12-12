/**
 * Created by pawelposel on 17/11/2016.
 */

import React, { Component, PropTypes } from 'react';

import OverlayAction from './OverlayAction';
import OverlayContent from './OverlayContent';

export {OverlayAction, OverlayContent};

export default class Overlay extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        className: PropTypes.string
    };

    static defaultProps = {
        className: "large"
    };

    componentWillUnmount() {
        $(this.refs.overlayObj)
            .modal('hide')
            .modal('destroy')
            .remove();
    }

    _showOverlay() {
        $(this.refs.overlayObj)
            .modal({observeChanges: true})
            .modal("show");
    }

    render() {
        var overlayAction = null;
        var overlayContent = null;

        var self = this;
        React.Children.forEach(this.props.children, function(child,index) {
            if (child.type && child.type.name === "OverlayAction") {
                overlayAction = React.cloneElement(child, {onClick:self._showOverlay.bind(self)});
            } else if (child.type && child.type.name === "OverlayContent") {
                overlayContent = child;
            }
        });

        return (
            <div>
                {overlayAction}
                <div className={`ui ${this.props.className} modal`} ref='overlayObj'>
                    {overlayContent}
                </div>
            </div>
        )
    }
}
