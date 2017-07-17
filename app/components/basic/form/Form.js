/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import {Form as FormSemanticUiReact, Input as FormInput, TextArea, Radio as FormRadio,
         Checkbox as FormCheckbox, Button as FormButton} from 'semantic-ui-react'
import ErrorMessage from '../ErrorMessage'
import FormField from './FormField'
import FormGroup from './FormGroup'
import FormDivider from './FormDivider'
import FormFile from './InputFile'
import FormDateRange from './InputDateRange'
import FormDropdown from '../Dropdown'

/**
 * Form is a component to present HTML forms
 *
 * Form is customized version of [Semantic UI-React's Form component](https://react.semantic-ui.com/collections/form),
 * so all properties of that component can be used here.
 *
 * errors prop can be just a string containing error message or an object with the following syntax:
 * ```
 * {
 *      field1: 'errorMessage1',
 *      field2: 'errorMessage2',
 *      ...
 * }
 * ```
 *
 * ## Access
 * `Stage.Basic.Form`
 *
 * ## Usage
 * ### Form before submission (no errors: _.isEmpty(this.state.errors))
 * ![Form](manual/asset/form/Form_0.png)
 *
 * ### Form after submission (with errors: !_.isEmpty(this.state.errors))
 * ![Form](manual/asset/form/Form_1.png)
 *
 * ```
 * <Form onSubmit={this._submitCreate.bind(this)} errors={this.state.errors} ref="createForm">
 *   <Form.Field error={this.state.errors.username}>
 *     <Form.Input name='username' placeholder="Username"
 *                 value={this.state.username} onChange={this._handleInputChange.bind(this)}/>
 *   </Form.Field>
 *
 *   <Form.Field error={this.state.errors.password}>
 *     <Form.Input name='password' placeholder="Password" type="password"
 *                 value={this.state.password} onChange={this._handleInputChange.bind(this)}/>
 *   </Form.Field>
 *
 *   <Form.Field error={this.state.errors.confirmPassword}>
 *     <Form.Input name='confirmPassword' placeholder="Confirm password" type="password"
 *                 value={this.state.confirmPassword} onChange={this._handleInputChange.bind(this)}/>
 *   </Form.Field>
 *
 *   <Form.Field error={this.state.errors.role}>
 *     <Form.Dropdown selection name='role' placeholder="Role" options={roleOptions}
 *                    value={this.state.role} onChange={this._handleInputChange.bind(this)}/>
 *   </Form.Field>
 * </Form>
 * ```
 *
 */
export default class Form extends Component {

    /**
     * Form field, see {@link FormField}
     */
    static Field = FormField;

    /**
     * Form group, see {@link FormGroup}
     */
    static Group = FormGroup;

    /**
     * Form divider, see {@link FormDivider}
     */
    static Divider = FormDivider;

    /**
     * Form input, see [Input](https://react.semantic-ui.com/elements/input)
     */

    static Input = FormInput;

    /**
     * Form text area input, see [TextArea](https://react.semantic-ui.com/addons/text-area)
     */
    static TextArea = TextArea;

    /**
     * Form radio button, see [Input](https://react.semantic-ui.com/addons/radio)
     */
    static Radio = FormRadio;

    /**
     * Form checkbox input, see [Checkbox](https://react.semantic-ui.com/modules/checkbox)
     */
    static Checkbox = FormCheckbox;

    /**
     * Form file input, see {@link InputFile}
     */
    static File = FormFile;

    /**
     * Dropdown field, see {@link Dropdown}
     */
    static Dropdown = FormDropdown;

    /**
     * Form date range input, see {@link InputDateRange}
     */
    static InputDateRange = FormDateRange;

    /**
     * Form checkbox input, see [Button](https://react.semantic-ui.com/elements/button)
     */
    static Button = FormButton;

    /**
     * propTypes
     * @property {object} [errors] string wiht error message or object with fields error messages (syntax described above)
     * @property {function} [onSubmit=()=>{}] function called on form submission
     * @property {function} [onErrorsDismiss=()=>{}] function called when errors are dismissed (see {@link ErrorMessage})
     */
    static propTypes = {
        ...Form.propTypes,
        errors: PropTypes.any,
        onSubmit: PropTypes.func,
        onErrorsDismiss: PropTypes.func
    };

    static defaultProps = {
        errors: null,
        onSubmit: () => {},
        onErrorsDismiss: () => {}
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
        let { errors, onErrorsDismiss, ...rest } = this.props;

        if (_.isString(errors)) {
            errors = [errors];
        } else if (_.isObject(errors)) {
            errors = _.valuesIn(errors);
        }

        return (
            <FormSemanticUiReact {...rest} onSubmit={this._handleSubmit.bind(this)} error={!_.isEmpty(errors)}>
                {this.props.children}

                <ErrorMessage header="Errors in the form" error={errors} onDismiss={this.props.onErrorsDismiss}/>

                <input type='submit' name="submitFormBtn" style={{"display": "none"}} ref='submitFormBtn'/>
            </FormSemanticUiReact>
        );
    }
}