/**
 * Created by jakub.niezgoda on 27/06/2018.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {Checkbox as SemanticUiReactCheckbox} from 'semantic-ui-react';

import { Form } from '../index';

/**
 * FormCheckbox is just a wrapper of Semantic-UI-React's Checkbox component to add help description near Checkbox label.
 * See [Checkbox](https://react.semantic-ui.com/modules/checkbox)
 *
 * ## Access
 * `Stage.Basic.Form.Checkbox`
 *
 * ## Usage
 * ![FormCheckbox](manual/asset/form/FormCheckbox_0.png)
 *
 * ```
 * <Form.Checkbox label="Run install workflow" toggle name="installWorkflow"
 *                help='Run install lifecycle operations'
 *                checked={this.state.installWorkflow} onChange={this._handleInputChange.bind(this)}/>
 * ```
 */
export default class FormCheckbox extends Component {

    /**
     * propTypes
     * @property {string} [label=''] checkbox label
     * @property {string} [help=''] help description
     */
    static propTypes = {
        label: PropTypes.string,
        help: PropTypes.string
    };

    static defaultProps = {
        label: '',
        help: ''
    };

    render() {
        let label = Form.Field.getLabel(this.props.label, this.props.help);

        return <SemanticUiReactCheckbox {...this.props} label={label} />
    }
}
