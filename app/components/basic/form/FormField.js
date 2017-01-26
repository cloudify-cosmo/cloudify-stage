/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Form } from 'semantic-ui-react'

export default class FormField extends Component {

    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string,
        width: PropTypes.any, //A field can specify its width in grid columns
        error: PropTypes.any, //Individual fields may display an error state
        disabled: PropTypes.bool,
        label: PropTypes.string
    };

    render() {
        let error = (_.isBoolean(this.props.error) && this.props.error) || !_.isEmpty(this.props.error);

        return (
            <Form.Field {...this.props} error={error}/>
        );
    }
}
