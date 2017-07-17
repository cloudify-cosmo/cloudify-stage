/**
 * Created by jakubniezgoda on 06/03/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Popup as PopupSemanticUiReact } from 'semantic-ui-react';

class Wrapper extends Component {

    static propTypes = {
        children: PropTypes.any
    };

    render() {
        return (null);
    }
}

/**
 * Popup is a component which wraps [Popup](https://react.semantic-ui.com/modules/popup) used to
 * display additional information popup.
 *
 * See [Popup](https://react.semantic-ui.com/modules/popup) component from Semantic-UI-React for details about props.
 *
 * ## Access
 * `Stage.Basic.Popup`
 *
 * ## Usage
 * ```
 * <Popup>
 *   <Popup.Trigger><Label icon="comment">Popup trigger</Label></Popup.Trigger>
 *   <div>Popup content</div>
 * </Popup>
 * ```
 *
 * ### Popup - closed (only popup trigger)
 * ![Popup](manual/asset/Popup_0.png)
 *
 * ### Popup - opened (mouse over trigger)
 * ![Popup](manual/asset/Popup_1.png)
 *
 */
export default class Popup extends Component {

    static Trigger = Wrapper;
    static Content = PopupSemanticUiReact.Content;
    static Header = PopupSemanticUiReact.Header;

    static propTypes = Popup.propTypes;

    render() {
        let props = this.props;
        let trigger = this.props.trigger;
        let children = this.props.children;

        React.Children.forEach(this.props.children, function (child) {
            if (child.type && child.type === Wrapper) {
                trigger = child.props.children;
                children = _.without(props.children, child);
            }
        });

        return (
            <PopupSemanticUiReact {...this.props} trigger={trigger}>
                {children}
            </PopupSemanticUiReact>
        );
    }
}
