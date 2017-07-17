/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component } from 'react';
import { Form } from 'semantic-ui-react'

/**
 * FormGroup is a component to group {@link FormField} components and is used in {@link FormWrapper} component
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
 *   <Form.Group inline widths="2">
 *     <Form.Field>
 *        <Form.InputDateRange fluid placeholder='Time Range' name="range"
 *                             value={this.state.fields.range} onChange={this._handleTimeRangeChange.bind(this)}/>
 *     </Form.Field>
 *
 *     <Form.Field>
 *        <Button disabled={!this.dirty} icon="remove" basic floated="right"
 *                onClick={this._resetFilter.bind(this)}/>
 *     </Form.Field>
 *   </Form.Group>
 *
 *   <Form.Group inline widths="2">
 *     <Form.Field>
 *       <Form.Input fluid type='number' name="resolution" label='Time Resolution'
 *                   max={Stage.Common.TimeConsts.MAX_TIME_RESOLUTION_VALUE}
 *                   min={Stage.Common.TimeConsts.MIN_TIME_RESOLUTION_VALUE}
 *                   value={this.state.fields.resolution} onChange={this._handleInputChange.bind(this)} />
 *     </Form.Field>
 *     <Form.Field>
 *        <Form.Dropdown fluid options={Stage.Common.TimeConsts.TIME_RESOLUTION_UNITS} name="unit" search selection
 *                       value={this.state.fields.unit} onChange={this._handleInputChange.bind(this)}/>
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
