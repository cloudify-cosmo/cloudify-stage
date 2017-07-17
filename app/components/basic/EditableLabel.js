/**
 * Created by kinneretzin on 15/11/2016.
 */

import React, { Component, PropTypes } from 'react';
import InlineEdit from 'react-edit-inline';

/**
 * EditableLabel component shows an (optionally) editable label.
 * If the label is editable it can have an optional placeholder and/or default text.
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

    /**
     * @property {string} [text=''] Label's default value
     * @property {string} [placeholder=''] Label's value if text {@link EditableLabel.text} value is not set
     * @property {string} [className=''] - Name of the style class to be added
     * @property {boolean} [isEditEnable=true] If 'true' make the label editable
     * @property {function} [onEditDone=()=>{}] Function to call when value has changed (returns label's text as attribute)
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
        isEditEnable: true,
        onEditDone : () => {},
        className: ''
    };

    render() {
        if (this.props.isEditEnable) {
            return (
                <InlineEdit
                    text={!_.isEmpty(this.props.text) ? this.props.text : this.props.placeholder}
                    className={this.props.className +' '+ (_.isEmpty(this.props.text) ? 'editPlaceholder' : '')}
                    change={(data)=>this.props.onEditDone(data.text)}
                    paramName="text"
                    />
            );
        } else {
            return (
                <span className={this.props.className}>{this.props.text}</span>
            );
        }
    }
}
