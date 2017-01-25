/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Form } from 'semantic-ui-react'

export default class FormGroup extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        className: PropTypes.string,
        widths: PropTypes.any, //Fields Groups can specify their width in grid columns or automatically divide fields to be equal width
        grouped: PropTypes.bool, //Fields can show related choices
        inline: PropTypes.bool //Multiple fields may be inline in a row
    };

    render() {
        return (
            <Form.Group {...this.props}/>
        );
    }
}
