/**
 * Created by kinneretzin on 15/11/2016.
 */

import React, { Component, PropTypes } from 'react';
import {Icon, Popup, Input, Checkbox, Dropdown, Form} from './index'

export default class GenericField extends Component {

    static STRING_TYPE = 'string';
    static PASSWORD_TYPE = 'password';
    static NUMBER_TYPE = 'number';
    static BOOLEAN_TYPE = 'boolean';
    static LIST_TYPE = 'list';
    static NUMBER_LIST_TYPE = 'numberList';
    static MULTI_SELECT_LIST_TYPE = 'multiSelectList';
    static EDITABLE_LIST_TYPE = 'editableList';
    static NUMBER_EDITABLE_LIST_TYPE = 'numberEditableList';

    static propTypes = {
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        placeholder: PropTypes.string,
        type: PropTypes.string,
        icon: PropTypes.string,
        description: PropTypes.string,
        value: PropTypes.any,
        items: PropTypes.array,
        onChange: PropTypes.func
    };

    static defaultProps = {
        placeholder: '',
        type: GenericField.STRING_TYPE,
        description: '',
        value: '',
        items: [],
        onChange: ()=>{}
    };

    static formatValue(type, value) {
        if (type === GenericField.MULTI_SELECT_LIST_TYPE) {
            value = _.split(value, ',');
        } else if (type === GenericField.BOOLEAN_TYPE) {
            value = (_.isBoolean(value) && value) || (_.isString(value) && value === "true");
        } else if (type === GenericField.NUMBER_TYPE ||
            type === GenericField.NUMBER_LIST_TYPE ||
            type === GenericField.NUMBER_EDITABLE_LIST_TYPE) {
            value = parseInt(value) || 0;
        }

        return value;
    }

    render() {
        var field;

        if (this.props.type === GenericField.STRING_TYPE ||
            this.props.type === GenericField.NUMBER_TYPE ||
            this.props.type === GenericField.PASSWORD_TYPE) {

            field = <Input icon={this.props.icon} iconPosition={this.props.icon?'left':undefined} name={this.props.name}
                           type={this.props.type === GenericField.STRING_TYPE?'text':this.props.type}
                           placeholder={this.props.placeholder} value={this.props.value === null ? "" : this.props.value}
                           onChange={(proxy, field)=>this.props.onChange(proxy, Object.assign({}, field, {genericType: this.props.type}))}/>;

        } else if (this.props.type === GenericField.BOOLEAN_TYPE) {

            field = <Checkbox name={this.props.name} toggle={true}
                              checked={(_.isBoolean(this.props.value) && this.props.value) ||
                                              (_.isString(this.props.value) && this.props.value === "true")}
                              onChange={(proxy, field)=>this.props.onChange(proxy, Object.assign({}, field, {genericType: this.props.type}))}/>

        } else if (this.props.type === GenericField.LIST_TYPE ||
                   this.props.type === GenericField.NUMBER_LIST_TYPE ||
                   this.props.type === GenericField.MULTI_SELECT_LIST_TYPE ||
                   this.props.type === GenericField.EDITABLE_LIST_TYPE ||
                   this.props.type === GenericField.NUMBER_EDITABLE_LIST_TYPE) {

            let options = []
            if (!_.isEmpty(this.props.items)) {
                options = _.map(this.props.items, item => {
                    if (!_.isObject(item)) {
                        item = {name:item, value:item};
                    }

                    return { text: item.name, value: item.value}
                });
            }

            field = <Dropdown fluid selection value={this.props.value} name={this.props.name}
                              multiple={this.props.type === GenericField.MULTI_SELECT_LIST_TYPE}
                              allowAdditions={this.props.type === GenericField.EDITABLE_LIST_TYPE || this.props.type === GenericField.NUMBER_EDITABLE_LIST_TYPE}
                              search={this.props.type === GenericField.EDITABLE_LIST_TYPE || this.props.type === GenericField.NUMBER_EDITABLE_LIST_TYPE}
                              placeholder={this.props.placeholder} options={options}
                              onChange={(proxy, field)=>this.props.onChange(proxy, Object.assign({}, field, {genericType: this.props.type}))}/>;
        }

        return (
            <Form.Field>
                <label>{this.props.label}&nbsp;
                    {
                        this.props.description &&
                        <Popup>
                            <Popup.Trigger><Icon name="help circle outline"/></Popup.Trigger>
                            {this.props.description}
                        </Popup>
                    }
                </label>

                {field}

            </Form.Field>
        );
    }
}