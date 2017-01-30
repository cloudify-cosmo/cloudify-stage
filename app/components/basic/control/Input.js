/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Input } from 'semantic-ui-react'

export default class InputWrapper extends Component {

    static propTypes = {
        children: PropTypes.any,
        action: PropTypes.any, //An Input can be formatted to alert the user to an action they may perform.
        actionPosition: PropTypes.any, //An action can appear along side an Input on the left or right.
        className: PropTypes.string,
        disabled: PropTypes.bool,
        error: PropTypes.bool, //An Input field can show the data contains errors.
        fluid: PropTypes.bool, //Take on the size of it's container.
        focus: PropTypes.bool, //An Input field can show a user is currently interacting with it.
        icon: PropTypes.any, //Optional Icon to display inside the Input.
        iconPosition: PropTypes.any, //An Icon can appear inside an Input on the left or right.
        inverted: PropTypes.bool, //Format to appear on dark backgrounds.
        label: PropTypes.any, //Optional Label to display along side the Input.
        labelPosition: PropTypes.any, //A Label can appear outside an Input on the left or right.
        loading: PropTypes.bool, //An Icon Input field can show that it is currently loading data.
        size: PropTypes.any, //An Input can vary in size.
        transparent: PropTypes.bool //Transparent Input has no background.
    };

    render() {
        return (
            <Input {...this.props}/>
        );
    }
}
