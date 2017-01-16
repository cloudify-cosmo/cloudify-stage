/**
 * Created by kinneretzin on 15/11/2016.
 */


import React, { Component, PropTypes } from 'react';

export default class Field extends Component {

    static STRING_TYPE = 'string';
    static NUMBER_TYPE = 'number';
    static BOOLEAN_TYPE = 'boolean';
    static LIST_TYPE = 'list';
    static NUMBER_LIST_TYPE = 'numberList';
    static MULTI_SELECT_LIST_TYPE = 'multiSelectList';
    static EDITABLE_LIST_TYPE = 'editableList';
    static NUMBER_EDITABLE_LIST_TYPE = 'numberEditableList';

    static propTypes = {
        label: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        placeholder: PropTypes.string,
        type: PropTypes.string,
        icon: PropTypes.string,
        description: PropTypes.string,
        value: PropTypes.any,
        items: PropTypes.array
    };

    static defaultProps = {
        placeholder: '',
        type: Field.STRING_TYPE,
        description: '',
        icon: '',
        value: '',
        items: []
    };

    render() {
        return (
            <div className="field">
                <label>{this.props.label}&nbsp;
                    {
                        this.props.description &&
                        <i className="help circle outline icon" data-content={this.props.description}/>
                    }
                </label>

                {
                    this.props.type === Field.STRING_TYPE &&
                    <div className="ui icon input fluid">
                        {this.props.icon && <i className={this.props.icon + " icon"}></i>}
                        <input className="fieldInput" data-id={this.props.id} data-type={this.props.type} type="text"
                               placeholder={this.props.placeholder} defaultValue={this.props.value}/>
                    </div>
                }
                {
                    this.props.type === Field.NUMBER_TYPE &&
                    <div className="ui icon input fluid">
                        {this.props.icon && <i className={this.props.icon + " icon"}></i>}
                        <input className="fieldInput" data-id={this.props.id} data-type={this.props.type} type="number"
                               placeholder={this.props.placeholder} defaultValue={this.props.value}/>
                    </div>
                }
                {
                    this.props.type === Field.BOOLEAN_TYPE &&
                    <div className="ui toggle checkbox" ref={(checkbox)=>{$(checkbox).checkbox()}}>
                        <input className="fieldInput" type="checkbox" data-id={this.props.id} data-type={this.props.type}
                               checked={(_.isBoolean(this.props.value) && this.props.value) ||
                                        (_.isString(this.props.value) && this.props.value === "true")}
                               onChange={()=>{}} data-type={this.props.type}/>
                    </div>
                }
                {
                    (this.props.type === Field.LIST_TYPE || this.props.type === Field.NUMBER_LIST_TYPE) &&
                    <DropdownList {...this.props}/>
                }
                {
                    this.props.type === Field.MULTI_SELECT_LIST_TYPE &&
                    <DropdownList {...this.props} className="multiple"/>
                }
                {
                    (this.props.type === Field.EDITABLE_LIST_TYPE || this.props.type === Field.NUMBER_EDITABLE_LIST_TYPE) &&
                    <DropdownList {...this.props} className="search" options={{allowAdditions: true}}/>
                }

            </div>
        );
    }
}

function DropdownList(props) {
    return (
        <div className={`ui fluid selection dropdown ${props.className}`} ref={(dropdown)=>{$(dropdown).dropdown(props.options)}}>
            <input className="fieldInput" type="hidden" data-id={props.id} data-type={props.type} value={props.value}/>
            <i className="dropdown icon"></i>
            <div className="default text">{props.placeholder}</div>
            <div className="menu">
                {
                    props.items.map((item)=> {
                        if (!_.isObject(item)) {
                            item = {name:item, value:item};
                        }

                        return <div className="item" key={item.value} data-value={item.value}>{item.name}</div>
                    })
                }
            </div>
        </div>
    )
}

DropdownList.defaultProps = {
    className: "",
    options: {}
}