/**
 * Created by jakubniezgoda on 06/02/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Loader } from 'semantic-ui-react'

export default class LoaderWrapper extends Component {

    static propTypes = {
        as: PropTypes.any, //An element type to render as (string or function).
        active: PropTypes.bool, //A loader can be active or visible.
        children: PropTypes.object, //Primary content.
        className: PropTypes.string, //Additional classes.
        content: PropTypes.any, //Shorthand for primary content.
        disabled: PropTypes.bool, //A loader can be disabled or hidden.
        indeterminate: PropTypes.bool, //A loader can show it's unsure of how long a task will take.
        inline: PropTypes.any, //{bool|enum} Loaders can appear inline with content.
        inverted: PropTypes.bool, //Loaders can have their colors inverted.
        size: PropTypes.any //Loaders can have different sizes. Enums: mini, tiny, small, medium, large, big, huge, massive
    };

    render() {
        return (
            <Loader {...this.props}/>
        );
    }
}


