/**
 * Created by pposel on 23/01/2017.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'

import { PopupHelp } from '../index';

/**
 * FormField is a component to present field and is used in {@link Form} component
 *
 * FormField is a wrapper for [Semantic UI-React's Form.Field component](https://react.semantic-ui.com/collections/form),
 * so all properties of that component can be used here.
 *
 * ## Access
 * `Stage.Basic.Form.Field`
 *
 * ## Usage
 * ### FormField with no error
 * ![FormField](manual/asset/form/FormField_0.png)
 *
 * ### FormField with error
 * ![FormField](manual/asset/form/FormField_1.png)
 *
 * ### FormField with help information, label and required indication
 * ![FormField](manual/asset/form/FormField_2.png)
 *
 * ```
 * <Form onSubmit={this._createTenant.bind(this)} errors={this.state.errors} ref='createForm'>
 *   <Form.Field error={this.state.errors.tenantName}>
 *     <Form.Input name='tenantName' placeholder='Tenant name'
 *                 value={this.state.tenantName} onChange={this._handleInputChange.bind(this)}/>
 *   </Form.Field>
 * </Form>
 * ```
 */
export default class FormField extends Component {
    /**
     * propTypes
     * @property {any} [error=false] error indicator: true - field has error, false - field has no errors (value casted to boolean by !!error)
     * @property {string} [help=''] if not empty, then help description is shown in popup on field's hover and focus
     * @property {string} [label=''] if not empty, then it's content is shown on top of field
     * @property {boolean} [required] if true and label is set, then red asterisk icon is presented near label
     */
    static propTypes = {
        error: PropTypes.any,
        help: PropTypes.string,
        label: PropTypes.string,
        required: PropTypes.bool
    };

    static defaultProps = {
        error: false,
        help: '',
        label: '',
        required: false
    };

    static getLabel(label, help) {
        return !_.isEmpty(label)
            ?
                <label>
                    {label}
                    {!_.isEmpty(help) && <span>&nbsp;<PopupHelp content={help} /></span>}
                </label>
            :
                null;
    }

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(this.props, nextProps);
    }

    getFieldWrapper(props) {
        let {children, error, label, help, ...fieldProps} = props;

        return (
            <Form.Field {...fieldProps} error={!!error}>
                {FormField.getLabel(label, help)}
                {children}
            </Form.Field>
        );
    };

    render() {
        return (_.isEmpty(this.props.label) && !_.isEmpty(this.props.help))
            ? <PopupHelp trigger={this.getFieldWrapper(this.props)} content={this.props.help} />
            : this.getFieldWrapper(this.props);
    }
}
