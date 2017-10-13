/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'

/**
 * FormGroup is a component to group {@link FormField} components and is used in {@link Form} component
 *
 * FormGroup is a wrapper for [Semantic UI-React's Form.Group component](https://react.semantic-ui.com/collections/form),
 * so all properties of that component can be used here.
 *
 * ## Access
 * `Stage.Basic.Form.Group`
 *
 * ## Usage
 *
 * ![FormGroup](manual/asset/form/FormGroup_0.png)
 *
 * ```
 * <Form size="small">
 *   <Form.Group>
 *     <Form.Field width="9" error={this.state.errors.widgetUrl}>
 *       <Form.Input label="URL" placeholder="Enter widget url" name="widgetUrl"
 *                   value={this.state.widgetUrl} onChange={this._handleInputChange.bind(this)}/>
 *     </Form.Field>
 *     <Form.Field width="1" style={{position:'relative'}}>
 *       <Divider vertical>Or</Divider>
 *     </Form.Field>
 *     <Form.Field width="8" error={this.state.errors.widgetUrl}>
 *       <Form.File placeholder="Select widget file" name="widgetFile" ref="widgetFile"/>
 *     </Form.Field>
 *   </Form.Group>
 * </Form>
 * ```
 */
export default class FormGroup extends Component {

    render() {
        return (
            <Form.Group {...this.props}/>
        );
    }
}
