/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Message } from 'semantic-ui-react'

export default class MessageWrapper extends Component {

    static propTypes = {
        attached: PropTypes.bool, //A message can be formatted to attach itself to other content.
        children: PropTypes.any, //Primary content.
        className: PropTypes.string, //Additional classes.
        color: PropTypes.string, //A message can be formatted to be different colors.
        compact: PropTypes.bool, //A message can only take up the width of its content.
        content: PropTypes.string, //Shorthand for primary content.
        error: PropTypes.bool, //A message may be formatted to display a negative message. Same as `negative`.
        floating: PropTypes.bool, //A message can float above content that it is related to.
        header: PropTypes.string, //Shorthand for MessageHeader.
        hidden: PropTypes.bool, //A message can be hidden.
        icon: PropTypes.any, //A message can contain an icon.
        info: PropTypes.bool, //A message may be formatted to display information.
        list: PropTypes.any, //Array shorthand items for the MessageList. Mutually exclusive with children.
        negative: PropTypes.bool, //A message may be formatted to display a negative message. Same as `error`.
        positive: PropTypes.bool, //A message may be formatted to display a positive message. Same as `success`.
        size: PropTypes.string, //A message can have different sizes.
        success: PropTypes.bool, //A message may be formatted to display a positive message. Same as `positive`.
        visible: PropTypes.bool, //A message can be set to visible to force itself to be shown.
        warning: PropTypes.bool, //A message may be formatted to display warning messages.
    };

    render() {
        return (
            <Message {...this.props}/>
        );
    }
}
