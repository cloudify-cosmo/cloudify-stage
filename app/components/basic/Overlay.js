/**
 * Created by pawelposel on 17/11/2016.
 */

import React, { Component, PropTypes } from 'react';

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
        var excludes = [];
        var includes = [];

        var self = this;
        React.Children.forEach(this.props.children, function(child,index) {
            if (child.props["data-overlay-action"]) {
                excludes.push(React.cloneElement(child, {onClick: self._showOverlay.bind(self), key: index}));
            } else {
                includes.push(child);
            }
        });

        return (
            <div>
                {excludes}
                <div className={`ui ${this.props.className} modal`} ref='overlayObj'>
                    <div className="content">{includes}</div>
                </div>
            </div>
        )
    }
}
 