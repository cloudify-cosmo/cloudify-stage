/**
 * Created by pawelposel on 17/11/2016.
 */

import React, { Component, PropTypes } from 'react';

import OverlayAction from './OverlayAction';
import OverlayContent from './OverlayContent';

export default class Overlay extends Component {

    static Action = OverlayAction;
    static Content = OverlayContent;

    static propTypes = {
        children: PropTypes.any.isRequired,
        className: PropTypes.string,
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

    show() {
        $(this.refs.overlayObj)
            .modal({observeChanges: true,
                    onShow: ()=>$('body').css({overflow: 'hidden'}),
                    onHide: ()=>$('body').css({overflow: 'inherit'})
            }).modal("show");
    }

    render() {
        var overlayAction = null;
        var overlayContent = null;
        var otherChildren = [];

        var self = this;
        React.Children.forEach(this.props.children, function(child,index) {
            if (child.type && child.type.name === "OverlayAction") {
                overlayAction = React.cloneElement(child, {onClick:self.show.bind(self)});
            } else if (child.type && child.type.name === "OverlayContent") {
                overlayContent = child;
            } else {
                otherChildren.push(child);
            }
        });

        return (
            <div>
                {overlayAction}
                <div className={`ui ${this.props.className} overlay modal`} ref='overlayObj'>
                    {overlayContent}
                    {otherChildren}
                </div>
            </div>
        )
    }
}