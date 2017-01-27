/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Icon } from 'semantic-ui-react'

export default class IconWrapper extends Component {

    static propTypes = {
        bordered: PropTypes.bool, //Formatted to appear bordered.
        circular: PropTypes.bool, //Icon can formatted to appear circular.
        className: PropTypes.string, //Additional classes.
        color: PropTypes.string, //Color of the icon.
        corner: PropTypes.bool, //Icons can display a smaller corner icon.
        disabled: PropTypes.bool, //Show that the icon is inactive.
        fitted: PropTypes.bool, //Fitted, without space to left or right of Icon.
        flipped: PropTypes.bool, //Icon can flipped.
        inverted: PropTypes.bool, //Formatted to have its colors inverted for contrast.
        link: PropTypes.bool, //Icon can be formatted as a link.
        loading: PropTypes.bool, //Icon can be used as a simple loader.
        name: PropTypes.string, //Name of the icon.
        rotated: PropTypes.string, //Icon can rotated.
        size: PropTypes.string //Size of the icon.
    };

    render() {
        return (
            <Icon {...this.props}/>
        );
    }
}
