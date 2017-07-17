/**
 * Created by pposel on 23/01/2017.
 */

import React, { Component, PropTypes } from 'react';

/**
 * FormDivider is a component to divide form fields using horizontal line in Form component
 *
 * ## Access
 * `Stage.Basic.Form.Divider`
 *
 * ## Usage
 *
 * ![FormDivider 0](manual/asset/form/FormDivider_0.png)
 *
 * ```
 * <Form loading={this.state.loading} errors={this.state.errors}>
 *
 *   <Form.Divider>
 *     <Form.Radio label="Run default workflow" name="runWorkflow" checked={this.state.runWorkflow === DEFAULT_WORKFLOW}
 *                 onChange={this._handleInputChange.bind(this)} value={DEFAULT_WORKFLOW}/>
 *   </Form.Divider>
 *
 *   <Form.Field>
 *     <Form.Checkbox label="Run install workflow on added nodes"
 *                    name="installWorkflow" disabled={this.state.runWorkflow !== DEFAULT_WORKFLOW}
 *                    checked={this.state.installWorkflow} onChange={this._handleInputChange.bind(this)}/>
 *   </Form.Field>
 *
 *   <Form.Field>
 *     <Form.Checkbox label="Run uninstall workflow on removed nodes"
 *                    name="uninstallWorkflow" disabled={this.state.runWorkflow !== DEFAULT_WORKFLOW}
 *                    checked={this.state.uninstallWorkflow} onChange={this._handleInputChange.bind(this)}/>
 *   </Form.Field>
 *
 *   <Form.Divider>
 *     <Form.Radio label="Run custom workflow" name="runWorkflow" checked={this.state.runWorkflow === CUSTOM_WORKFLOW}
 *                 onChange={this._handleInputChange.bind(this)} value={CUSTOM_WORKFLOW}/>
 *   </Form.Divider>
 *
 *   <Form.Field error={this.state.errors.workflowId}>
 *     <Form.Input name='workflowId' placeholder="Workflow ID" disabled={this.state.runWorkflow !== CUSTOM_WORKFLOW}
 *                 value={this.state.workflowId} onChange={this._handleInputChange.bind(this)}/>
 *   </Form.Field>
 * </Form>
 * ```
 *
 */
export default class FormDivider extends Component {

    /**
     * propTypes
     * @property {object} children primary content
     * @property {string} [className] stylesheet classes to add to h4 element
     */
    static propTypes = {
        children: PropTypes.any,
        className: PropTypes.string
    };

    render() {
        return (
            <h4 className={`ui dividing header ${this.props.className}`}>
                {this.props.children}
            </h4>
        );
    }
}