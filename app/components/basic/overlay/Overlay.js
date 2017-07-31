/**
 * Created by pawelposel on 17/11/2016.
 */

import React, { Component, PropTypes } from 'react';

import OverlayAction from './OverlayAction';
import OverlayContent from './OverlayContent';

/**
 * Overlay is a component to present data in simple modal window
 *
 * Content data are defined inside {@link OverlayContent} component.
 *
 * Overlay trigger is defined inside {@link OverlayAction} component.
 *
 * ## Access
 * `Stage.Basic.Overlay`
 *
 * ## Usage
 * ### Overlay hidden (only trigger visible) *
 * ![Overlay](manual/asset/overlay/Overlay_0.png)
 *
 * ### Overlay visible *
 * ![Overlay](manual/asset/overlay/Overlay_1.png)
 *
 * ```
 * <Overlay>
 *   <Overlay.Action title="Click button to open overlay">
 *     <Button>Details</Button>
 *   </Overlay.Action>
 *   <Overlay.Content>
 *     <p>Overlay content</p>
 *   </Overlay.Content>
 * </Overlay>
 * ```
 */
export default class Overlay extends Component {

    /**
     * Overlay action, see {@link OverlayAction}
     */
    static Action = OverlayAction;

    /**
     * Overlay content, see {@link OverlayContent}
     */
    static Content = OverlayContent;

    /**
     * propTypes
     * @property {object[]} children primary content
     * @property {string} [className='large'] CSS classname to add to modal window <div>
     */
    static propTypes = {
        children: PropTypes.any.isRequired,
        className: PropTypes.string,
    };

    static defaultProps = {
        className: 'large'
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
            }).modal('show');
    }

    render() {
        var overlayAction = null;
        var overlayContent = null;
        var otherChildren = [];

        var self = this;
        React.Children.forEach(this.props.children, function(child,index) {
            if (child.type && child.type === OverlayAction) {
                overlayAction = React.cloneElement(child, {onClick:self.show.bind(self)});
            } else if (child.type && child.type === OverlayContent) {
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