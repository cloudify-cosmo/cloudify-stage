/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Image } from 'semantic-ui-react'

export default class ImageWrapper extends Component {

    static propTypes = {
        alt: PropTypes.string, //Alternate text for the image specified.
        avatar: PropTypes.bool, //An image may be formatted to appear inline with text as an avatar.
        bordered: PropTypes.bool, //An image may include a border to emphasize the edges of white or transparent content.
        centered: PropTypes.bool, //An image can appear centered in a content block.
        children: PropTypes.any, //Primary content.
        className: PropTypes.string, //Additional classes.
        disabled: PropTypes.bool, //An image can show that it is disabled and cannot be selected.
        floated: PropTypes.string, //An image can sit to the left or right of other content. Enums: left, right
        fluid: PropTypes.any, //An image can take up the width of its container.
        height: PropTypes.any, //The img element height attribute.
        hidden: PropTypes.bool, //An image can be hidden.
        href: PropTypes.string, //Renders the Image as an <a> tag with this href.
        inline: PropTypes.bool, //An image may appear inline.
        label: PropTypes.string, //Shorthand for Label.
        shape: PropTypes.string, //An image may appear rounded or circular. Enums: rounded, circular
        size: PropTypes.string, //An image may appear at different sizes. Enums: mini, tiny, small, medium, large, big, huge, massive
        spaced: PropTypes.bool, //An image can specify that it needs an additional spacing to separate it from nearby content.
        src: PropTypes.string, //Specifies the URL of the image.
        ui: PropTypes.bool, //Whether or not to add the ui className.
        verticalAlign: PropTypes.string, //An image can specify its vertical alignment. Enums: bottom, middle, top
        width: PropTypes.any //The img element width attribute.
    };

    render() {
        return (
            <Image {...this.props}/>
        );
    }
}
