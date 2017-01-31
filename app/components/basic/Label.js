/**
 * Created by jakubniezgoda on 31/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Label } from 'semantic-ui-react'

export default class LabelWrapper extends Component {

    static propTypes = {
        as: PropTypes.any, //An element type to render as (string or function).
        attached: PropTypes.any, //A label can attach to a content segment.
        basic: PropTypes.bool, //A label can reduce its complexity.
        children: PropTypes.any, //Primary content.
        circular: PropTypes.bool, //A label can be circular.
        className: PropTypes.string, //Additional classes.
        color: PropTypes.any, //Color of the label.
        content: PropTypes.any, //Shorthand for primary content.
        corner: PropTypes.any, //(bool|enum) A label can position itself in the corner of an element.
        detail: PropTypes.any, //Shorthand for LabelDetail.
        empty: PropTypes.any, //Formats the label as a dot.
        floating: PropTypes.bool, //Float above another element in the upper right corner.
        horizontal: PropTypes.bool, //A horizontal label is formatted to label content along-side it horizontally.
        icon: PropTypes.any, //Shorthand for Icon.
        image: PropTypes.any, //(bool|custom) A label can be formatted to emphasize an image or prop can be used as shorthand for Image.
        onClick: PropTypes.func, //Called on click. Signature: onClick(event: SyntheticEvent, data: object), event - React's original SyntheticEvent. data - All props.
        onRemove: PropTypes.func,  //Adds an "x" icon, called when "x" is clicked. Signature: onRemove(event: SyntheticEvent, data: object), event - React's original SyntheticEvent., data - All props.
        pointing: PropTypes.any, //(bool|enum) A label can point to content next to it.
        removeIcon: PropTypes.any, //Shorthand for Icon to appear as the last child and trigger onRemove.
        ribbon: PropTypes.any, //(bool|enum) A label can appear as a ribbon attaching itself to an element.
        size: PropTypes.any, //A label can have different sizes.
        tag: PropTypes.bool, //A label can appear as a tag.
    };

    render() {
        return (
            <Label {...this.props}/>
        );
    }
}
