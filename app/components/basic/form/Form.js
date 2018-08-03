/**
 * Created by pposel on 23/01/2017.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {Form as FormSemanticUiReact, Input as FormInput, TextArea, Radio as FormRadio,
        Button as FormButton} from 'semantic-ui-react';
import ErrorMessage from '../ErrorMessage';
import FormField from './FormField';
import FormCheckbox from './FormCheckbox';
import FormGroup from './FormGroup';
import FormDivider from './FormDivider';
import FormFile from './InputFile';
import FormUrlOrFile from './InputUrlOrFile';
import FormInputDate from './InputDate';
import FormInputTime from './InputTime';
import FormDropdown from '../Dropdown';
import FormTable from './EdiTable';
import FormColorPicker from './ColorPicker';
import '../../styles/Form.css';

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
     * Form checkbox input, {@link FormCheckbox}
     */
    static Checkbox = FormCheckbox;

    /**
     * Form file input, see {@link InputFile}
     */
    static File = FormFile;

    /**
     * Form URL or file input, see {@link InputUrlOrFile}
     */
    static UrlOrFile = FormUrlOrFile;

    /**
     * Dropdown field, see {@link Dropdown}
     */
    static Dropdown = FormDropdown;

    /**
     * Calendar picker input, see {@link InputDate}
     */
    static InputDate = FormInputDate;

    /**
     * Time picker input, see {@link InputTime}
     */
    static InputTime = FormInputTime;

    /**
     * Form checkbox input, see [Button](https://react.semantic-ui.com/elements/button)
     */
    static Button = FormButton;

    /**
     * Form table input, see {@link EdiTable}
     */
    static Table = FormTable;

    /**
     * Form color picker input, see {@link ColorPicker}
     */
    static ColorPicker = FormColorPicker;

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
        var value = field.value;

        if (field.type === 'checkbox')
            value = field.checked;
        if (field.type === 'number')
            value = parseInt(field.value);

        if (_.isEmpty(name)) {
            console.error('Required name attribute is not provided!', field);
            throw 'Required name attribute is not provided!';
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
                <ErrorMessage header="Errors in the form" error={errors} onDismiss={onErrorsDismiss}/>

                {this.props.children}

                <input type='submit' name="submitFormBtn" style={{'display': 'none'}} ref='submitFormBtn'/>
            </FormSemanticUiReact>
        );
    }
}