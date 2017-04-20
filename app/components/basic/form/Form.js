/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import {Form, Message, Input as FormInput, TextArea, Radio as FormRadio,
         Checkbox as FormCheckbox, Button as FormButton} from 'semantic-ui-react'
import FormField from './FormField'
import FormGroup from './FormGroup'
import FormDivider from './FormDivider'
import FormFile from '../InputFile'
import FormDate from '../InputDate'
import FormDateRange from '../InputDateRange'
import FormDropdown from '../Dropdown'

export default class FormWrapper extends Component {

    static Field = FormField;
    static Group = FormGroup;
    static Divider = FormDivider;
    static Input = FormInput;
    static TextArea = TextArea;
    static Radio = FormRadio;
    static Checkbox = FormCheckbox;
    static File = FormFile;
    static Dropdown = FormDropdown;
    static InputDate = FormDate;
    static InputDateRange = FormDateRange;
    static Button = FormButton;

    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string,
        errors: PropTypes.any,
        loading: PropTypes.bool,
        onSubmit: PropTypes.func
    };

    static fieldNameValue(field) {
        const name = field.name;
        const value = field.type === 'checkbox' ? field.checked : field.value;

        if (_.isEmpty(name)) {
            console.error("Required name attribute is not provided!", field);
            throw "Required name attribute is not provided!";
        }

        return {[name]: value};
    }

    submit() {
        $(this.refs.submitFormBtn).click();
    }

    _handleSubmit(e, data) {
        e.preventDefault();
        this.props.onSubmit && this.props.onSubmit(data.formData);
        return false;
    }

    render() {
        let { errors, ...rest } = this.props;

        if (_.isString(errors)) {
            errors = [errors];
        } else if (_.isObject(errors)) {
            errors = _.valuesIn(errors);
        }

        return (
            <Form {...rest} onSubmit={this._handleSubmit.bind(this)} error={!_.isEmpty(errors)}>
                {this.props.children}

                <Message error list={errors}/>

                <input type='submit' name="submitFormBtn" style={{"display": "none"}} ref='submitFormBtn'/>
            </Form>
        );
    }
}