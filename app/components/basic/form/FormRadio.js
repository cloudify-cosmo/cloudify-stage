/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Radio } from 'semantic-ui-react'

export default class FormRadio extends Component {

    static propTypes = {
        checked: PropTypes.bool,
        className: PropTypes.string,
        defaultChecked: PropTypes.bool, //The initial value of checked.
        disabled: PropTypes.bool, //A radio can appear disabled and be unable to change states
        fitted: PropTypes.bool, //Removes padding for a label. Auto applied when there is no label.
        label: PropTypes.string, //The text of the associated label element.
        readOnly: PropTypes.bool //A checkbox can be read-only and unable to change states.
    };

    render() {
        return (
            <Radio {...this.props}/>
        );
    }
}
