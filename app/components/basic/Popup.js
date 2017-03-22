/**
 * Created by jakubniezgoda on 06/03/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Popup } from 'semantic-ui-react';

class Wrapper extends Component {

    static propTypes = {
        children: PropTypes.any
    };

    render() {
        return (null);
    }
}

export default class PopupWrapper extends Component {

    static Trigger = Wrapper;

    static propTypes = Popup.propTypes;

    render() {
        let props = this.props;
        let trigger = this.props.trigger;
        let children = this.props.children;

        React.Children.forEach(this.props.children, function (child) {
            if (child.type && child.type.name === "Wrapper") {
                trigger = <span>{child.props.children}</span>;
                children = _.without(props.children, child);
            }
        });

        return (
            <Popup {...this.props} trigger={trigger}>
                {children}
            </Popup>
        );
    }
}
