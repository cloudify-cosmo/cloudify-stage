/**
 * Created by kinneretzin on 15/11/2016.
 */

import React, { Component, PropTypes } from 'react';
import InlineEdit from 'react-edit-inline';

export default class EditableLabel extends Component {

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
        onEditDone : () => {}
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
