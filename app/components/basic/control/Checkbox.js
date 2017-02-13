/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Checkbox } from 'semantic-ui-react'

export default class CheckboxWrapper extends Component {

    static propTypes = {
        checked: PropTypes.bool,
        className: PropTypes.string,
        defaultChecked: PropTypes.bool, //The initial value of checked.
        defaultIndeterminate: PropTypes.bool, //Whether or not checkbox is indeterminate.
        disabled: PropTypes.bool,
        fitted: PropTypes.bool, //Removes padding for a label. Auto applied when there is no label.
        indeterminate: PropTypes.bool, //Whether or not checkbox is indeterminate.
        label: PropTypes.string, //The text of the associated label element.
        readOnly: PropTypes.bool, //A checkbox can be read-only and unable to change states.
        slider: PropTypes.any, //Format to emphasize the current selection state.
        toggle: PropTypes.any //Format to show an on or off choice.
    };

    render() {
        return (
            <Checkbox {...this.props}/>
        );
    }
}
