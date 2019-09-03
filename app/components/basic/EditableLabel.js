/**
 * Created by kinneretzin on 15/11/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';

/**
 * EditableLabel component shows an editable label.
 * Label can have an optional placeholder and/or default text.
 *
 * ## Access
 * `Stage.Basic.EditableLabel`
 *
 * ## Usage
 *
 * ### Read-only label
 *
 * ![EditableLabel](manual/asset/editableLabel/EditableLabel_0.png)
 * ```
 * <EditableLabel isEditEnable={false} text="Sample Text" />
 *
 * ```
 *
 * ### Editable label (focused)
 *
 * ![EditableLabel](manual/asset/editableLabel/EditableLabel_1.png)
 * ```
 * <EditableLabel placeholder="Enter your text here..." />
 *
 * ```
 */
export default class EditableLabel extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = EditableLabel.initialState(props);
    }

    /**
     * @property {string} [text=''] Label's default value
     * @property {string} [placeholder=''] Label's value if text {@link EditableLabel.text} value is not set
     * @property {string} [className=''] - Name of the style class to be added
     * @property {boolean} [isEditEnable=true] If 'true' make the label editable
     * @property {Function} [onEditDone=()=>{}] Function to call when value has changed (returns label's text as attribute)
     */
    static propTypes = {
        text: PropTypes.string,
        placeholder: PropTypes.string,
        className: PropTypes.string,
        isEditEnable: PropTypes.bool,
        onEditDone: PropTypes.func
    };

    static defaultProps = {
        text: '',
        placeholder: '',
        className: '',
        isEditEnable: true,
        onEditDone: () => {}
    };

    static initialState = props => {
        return {
            editing: false,
            text: props.text
        };
    };

    labelClicked() {
        if (this.props.isEditEnable) {
            this.setState({ editing: true });
        }
    }

    textChanged(event) {
        this.setState({ text: event.target.value });
    }

    inputLostFocus() {
        if (this.props.isEditEnable) {
            this.props.onEditDone(this.state.text);
            this.setState({ editing: false });
        }
    }

    keyPressed(event) {
        if (event.key === 'Enter') {
            this.inputLostFocus();
        }
    }

    render() {
        const className = `${this.props.className} ${_.isEmpty(this.props.text) ? 'editPlaceholder' : ''}`;

        if (this.state.editing) {
            return (
                <input
                    type="text"
                    value={this.state.text}
                    autoFocus
                    onClick={event => {
                        event.stopPropagation();
                        this.labelClicked();
                    }}
                    onChange={this.textChanged.bind(this)}
                    onBlur={this.inputLostFocus.bind(this)}
                    onKeyPress={this.keyPressed.bind(this)}
                    className={className}
                />
            );
        }
        const text = this.props.isEditEnable ? this.props.text || this.props.placeholder : this.props.text;

        return (
            <label
                onClick={event => {
                    event.stopPropagation();
                    this.labelClicked();
                }}
                className={className}
            >
                {text}
            </label>
        );
    }
}
