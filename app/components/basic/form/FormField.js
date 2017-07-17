/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';
import { Form } from 'semantic-ui-react'

/**
 * FormField is a component to present field and is used in {@link FormWrapper} component
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
     * @property {boolean} [error] error indicator (true - field has error, false - field has no errors)
     */
    static propTypes = {
        error: PropTypes.any
    };

    render() {
        let error = (_.isBoolean(this.props.error) && this.props.error) || !_.isEmpty(this.props.error);

        return (
            <Form.Field {...this.props} error={error}/>
        );
    }
}
