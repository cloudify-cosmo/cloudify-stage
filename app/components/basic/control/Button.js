/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Button } from 'semantic-ui-react'

export default class ButtonWrapper extends Component {

    static propTypes = {
        active: PropTypes.bool, //A button can show it is currently the active user selection.
        animated: PropTypes.bool, //A button can animate to show hidden content.
        attached: PropTypes.string, //A button can be attached to the top or bottom of other content.
        basic: PropTypes.bool, //A basic button is less pronounced.
        children: PropTypes.any, //Primary content.
        circular: PropTypes.bool, //A button can be circular.
        className: PropTypes.string, //Additional classes.
        color: PropTypes.string, //A button can have different colors
        compact: PropTypes.bool, //A button can reduce its padding to fit into tighter spaces.
        content: PropTypes.string, //Shorthand for primary content.
        disabled: PropTypes.bool, //A button can show it is currently unable to be interacted with.
        floated: PropTypes.string, //A button can be aligned to the left or right of its container.
        fluid: PropTypes.bool, //A button can take the width of its container.
        icon: PropTypes.string, //Add an Icon by name, props object, or pass an <Icon />.
        inverted: PropTypes.bool, //A button can be formatted to appear on dark backgrounds.
        label: PropTypes.any, //Add a Label by text, props object, or pass a <Label />.
        labelPosition: PropTypes.string, //A labeled button can format a Label or Icon to appear on the left or right.
        loading: PropTypes.bool, //A button can show a loading indicator.
        negative: PropTypes.bool, //A button can hint towards a negative consequence.
        positive: PropTypes.bool, //A button can hint towards a positive consequence.
        primary: PropTypes.bool, //A button can be formatted to show different levels of emphasis.
        secondary: PropTypes.bool, //A button can be formatted to show different levels of emphasis.
        size: PropTypes.string, //A button can have different sizes.
        toggle: PropTypes.bool, //A button can be formatted to toggle on and off.
    };

    render() {
        return (
            <Button {...this.props}/>
        );
    }
}
